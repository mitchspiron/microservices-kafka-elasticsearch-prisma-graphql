import { IEventPublisher } from "../../domain/services/IEventPublisher";
import { Kafka, Producer } from "kafkajs";

export class KafkaEventPublisher implements IEventPublisher {
  private producer: Producer;

  constructor(private kafka: Kafka) {
    // Initialize Kafka producer
    this.producer = this.kafka.producer();
  }

  // Connect to Kafka broker
  async connect() {
    await this.producer.connect();
  }

  // Publish an event to a specified topic
  async publish(topic: string, message: any): Promise<void> {
    await this.producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });
  }

  // Disconnect from Kafka broker
  async disconnect() {
    await this.producer.disconnect();
  }
}
