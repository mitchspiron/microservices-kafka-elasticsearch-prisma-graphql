export interface IEventPublisher {
  publish(topic: string, message: any): Promise<void>;
}
