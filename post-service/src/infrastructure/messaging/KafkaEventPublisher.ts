import { Kafka, Producer } from "kafkajs";
import { IEventPublisher } from "../../domain/services/IEventPublisher";

export class KafkaEventPublisher implements IEventPublisher {
  private producer: Producer;

  constructor(private kafka: Kafka) {
    this.producer = kafka.producer();
  }

  async connect() {
    await this.producer.connect();
  }

  async publish(topic: string, message: any): Promise<void> {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  async disconnect() {
    await this.producer.disconnect();
  }
}
