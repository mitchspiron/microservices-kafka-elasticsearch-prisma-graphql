import { CreatePostInput } from "../../domain/entities/Post";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { IEventPublisher } from "../../domain/services/IEventPublisher";

export class CreatePostUseCase {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly eventPublisher: IEventPublisher
  ) {}

  async execute(input: CreatePostInput) {
    const post = await this.postRepository.create(input);

    // Publish an event after creating the post
    await this.eventPublisher.publish("PostCreated", {
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      createdAt: post.createdAt,
    });

    return post;
  }
}
