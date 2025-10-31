import { ISearchService } from "../../domain/services/ISearchService";

export class SearchPostsUseCase {
  constructor(private searchService: ISearchService) {}

  async execute(query: string) {
    return await this.searchService.searchPosts(query);
  }
}
