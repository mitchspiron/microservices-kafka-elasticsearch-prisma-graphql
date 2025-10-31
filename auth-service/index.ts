import { Kafka } from "kafkajs";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { PrismaClient } from "@prisma/client";
import { PrismaUserRepository } from "./src/infrasctructure/database/PrismaUserRepository";
import { KafkaEventPublisher } from "./src/infrasctructure/messaging/KafkaEventPublisher";
import { RegisterUseCase } from "./src/application/usecases/RegisterUseCase";
import { LoginUseCase } from "./src/application/usecases/LoginUseCase";
import { createResolvers } from "./src/presentation/graphql/resolvers";
import { typeDefs } from "./src/presentation/graphql/schema";

dotenv.config();

async function main() {
  const prisma = new PrismaClient();
  const kafka = new Kafka({
    clientId: "auth-service",
    brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
  });

  const userRepository = new PrismaUserRepository(prisma);
  const eventPublisher = new KafkaEventPublisher(kafka);
  await eventPublisher.connect();

  const jwtSecret = process.env.JWT_SECRET || "wesh_ma_gueule";

  const registerUseCase = new RegisterUseCase(
    userRepository,
    eventPublisher,
    jwtSecret
  );

  const loginUseCase = new LoginUseCase(userRepository, jwtSecret);

  const resolvers = createResolvers(registerUseCase, loginUseCase);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(process.env.PORT) || 4001 },
  });
}

main().catch((error) => {
  console.error("Error starting the server:", error);
  process.exit(1);
});
