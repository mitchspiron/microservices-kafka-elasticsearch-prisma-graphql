import { Post } from "../entities/Post";

export interface ISearchService {
  indexPost(post: Post): Promise<void>;
  searchPosts(query: string): Promise<Post[]>;
  deletePost(id: string): Promise<void>;
}
