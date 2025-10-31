import { CreatePostInput, Post, UpdatePostInput } from "../entities/Post";

export interface IPostRepository {
  create(data: CreatePostInput): Promise<Post>;
  findById(id: string): Promise<Post | null>;
  findByAuthorId(authorId: string): Promise<Post[]>;
  update(id: string, data: UpdatePostInput): Promise<Post>;
  delete(id: string): Promise<void>;
}
