import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";
import dotenv from "dotenv";
import { PrismaPostRepository } from "./infrastructure/database/PrismaPostRepository";
import { ElasticsearchService } from "./infrastructure/search/ElasticsearchService";
import { KafkaEventPublisher } from "./infrastructure/messaging/KafkaEventPublisher";
import { KafkaEventConsumer } from "./infrastructure/messaging/KafkaEventConsumer";
import { CreatePostUseCase } from "./application/usecases/CreatePostUseCase";
import { GetMyPostsUseCase } from "./application/usecases/GetMyPostsUseCase";
import { SearchPostsUseCase } from "./application/usecases/SearchPostsUseCase";
import { typeDefs } from "./presentation/graphql/schema";
import { createResolvers } from "./presentation/graphql/resolvers";
import { authMiddleware } from "./presentation/middleware/auth";

dotenv.config();

async function main() {
  const prisma = new PrismaClient();
  const kafka = new Kafka({
    clientId: "post-service",
    brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
  });

  const postRepository = new PrismaPostRepository(prisma);

  const elasticsearchNode =
    process.env.ELASTICSEARCH_NODE || "http://localhost:9200";
  const searchService = new ElasticsearchService(elasticsearchNode);
  await searchService.initialize();

  const eventPublisher = new KafkaEventPublisher(kafka);
  await eventPublisher.connect();

  const eventConsumer = new KafkaEventConsumer(kafka, searchService);
  await eventConsumer.connect();

  const jwtSecret = process.env.JWT_SECRET || "secret";

  const createPostUseCase = new CreatePostUseCase(
    postRepository,
    eventPublisher
  );
  const getMyPostsUseCase = new GetMyPostsUseCase(postRepository);
  const searchPostsUseCase = new SearchPostsUseCase(searchService);

  const resolvers = createResolvers(
    createPostUseCase,
    getMyPostsUseCase,
    searchPostsUseCase
  );

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(process.env.PORT) || 4003 },
    context: authMiddleware(jwtSecret),
  });

  console.log(`🚀 Post Service ready at ${url}`);
}

main().catch((error) => {
  console.error("Error starting the server:", error);
  process.exit(1);
});
