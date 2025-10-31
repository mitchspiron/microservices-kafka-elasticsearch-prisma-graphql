import { Consumer, Kafka } from "kafkajs";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class KafkaEventConsumer {
  private consumer: Consumer;

  constructor(private kafka: Kafka, private userRepository: IUserRepository) {
    // Initialize Kafka consumer
    this.consumer = this.kafka.consumer({ groupId: "user-service-group" });
  }

  async connect() {
    // Connect to Kafka broker
    await this.consumer.connect();
    // Subscribe to user.created topic
    await this.consumer.subscribe({
      topics: ["user.created"],
      fromBeginning: true,
    });

    // Handle user.created events
    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (topic === "user.created") {
          const event = JSON.parse(message.value!.toString());
          // Process the user.created event
          await this.handleUserCreated(event);
        }
      },
    });
  }

  private async handleUserCreated(event: any) {
    try {
      // Replicate the user in the user service database
      await this.userRepository.create({
        id: event.userId,
        email: event.email,
        name: event.name,
      });
      console.log(
        `User ${event.userId} replicated successfully from auth service.`
      );
    } catch (error) {
      console.error("Error replicating user:", error);
    }
  }

  async disconnect() {
    // Disconnect from Kafka broker
    await this.consumer.disconnect();
  }
}
