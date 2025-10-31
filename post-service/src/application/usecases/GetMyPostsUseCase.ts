import { IPostRepository } from "../../domain/repositories/IPostRepository";

export class GetMyPostsUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(authorId: string) {
    return await this.postRepository.findByAuthorId(authorId);
  }
}
