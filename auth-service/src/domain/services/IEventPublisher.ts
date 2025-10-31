export interface IEventPublisher {
  // Publishes an event to a specified topic
  publish(topic: string, message: any): Promise<void>;
}
