import { Kafka } from "kafkajs";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { PrismaClient } from "@prisma/client";
import { createResolvers } from "./presentation/graphql/resolvers";
import { typeDefs } from "./presentation/graphql/schema";
import { PrismaUserRepository } from "./infrastructure/database/PrismaUserRepository";
import { KafkaEventPublisher } from "./infrastructure/messaging/KafkaEventPublisher";
import { KafkaEventConsumer } from "./infrastructure/messaging/KafkaEventConsumer";
import { GetUserUseCase } from "./application/usecases/GetUserUseCase";
import { UpdateUserUseCase } from "./application/usecases/UpdateUserUseCase";
import { authMiddleware } from "./presentation/middleware/auth";

dotenv.config();

async function main() {
  const prisma = new PrismaClient();
  const kafka = new Kafka({
    clientId: "user-service",
    brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
  });

  const userRepository = new PrismaUserRepository(prisma);
  
  const eventPublisher = new KafkaEventPublisher(kafka);
  await eventPublisher.connect();

  const eventConsumer = new KafkaEventConsumer(kafka, userRepository);
  await eventConsumer.connect();

  const jwtSecret = process.env.JWT_SECRET || "wesh_ma_gueule";

  const getUserUseCase = new GetUserUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(
    userRepository,
    eventPublisher
  );

  const resolvers = createResolvers(getUserUseCase, updateUserUseCase);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(process.env.PORT) || 4002 },
    context: authMiddleware(jwtSecret),
  });

  console.log(`🚀 User service ready at: ${url}`);
}

main().catch((error) => {
  console.error("Error starting the server:", error);
  process.exit(1);
});
