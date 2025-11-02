import { Consumer, Kafka } from "kafkajs";
import { ISearchService } from "../../domain/services/ISearchService";

export class KafkaEventConsumer {
  private consumer: Consumer;

  constructor(private kafka: Kafka, private searchService: ISearchService) {
    this.consumer = kafka.consumer({ groupId: "post-service-group" });
  }

  async connect() {
    // Connect to Kafka and subscribe to topics
    await this.consumer.connect();

    // Subscribe to relevant topics
    await this.consumer.subscribe({
      topics: ["post.created", "post.updated"],
      fromBeginning: true,
    });

    // Handlers for different events
    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        const event = JSON.parse(message.value!.toString());
        if (topic === "post.created") {
          await this.handlePostCreated(event);
        } else if (topic === "post.updated") {
          await this.handlePostUpdated(event);
        }
      },
    });
  }

  private async handlePostCreated(event: any) {
    try {
      // Index the new post in Elasticsearch
      await this.searchService.indexPost(event);
      console.log(`Post ${event.id} indexed in Elasticsearch`);
    } catch (error) {
      console.error("Error indexing post:", error);
    }
  }

  private async handlePostUpdated(event: any) {
    try {
      // Update the post in Elasticsearch
      await this.searchService.indexPost(event);
      console.log(`Post ${event.id} updated in Elasticsearch`);
    } catch (error) {
      console.error("Error updating post in Elasticsearch:", error);
    }
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}
