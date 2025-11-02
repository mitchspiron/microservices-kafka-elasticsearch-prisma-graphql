import { Client } from "@elastic/elasticsearch";
import { ISearchService } from "../../domain/services/ISearchService";
import { Post } from "../../domain/entities/Post";

export class ElasticsearchService implements ISearchService {
  private client: Client;
  private indexName: string = "posts";

  constructor(node: string) {
    // Initialize Elasticsearch client
    this.client = new Client({ node });
  }

  async initialize() {
    // Check if the index exists, if not create it
    const exists = await this.client.indices.exists({ index: this.indexName }); // return true or false

    if (!exists) {
      await this.client.indices.create({
        index: this.indexName,
        mappings: {
          properties: {
            id: { type: "keyword" },
            title: { type: "text" },
            content: { type: "text" },
            authorId: { type: "keyword" },
            createdAt: { type: "date" },
          },
        },
      });

      console.log(`Index "${this.indexName}" created.`);
    } else {
      console.log(`Index "${this.indexName}" already exists.`);
    }
  }

  async indexPost(post: Post): Promise<void> {
    // Index a post document in Elasticsearch for searching purposes
    await this.client.index({
      index: this.indexName,
      id: post.id,
      document: {
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        createdAt: post.createdAt,
      },
    });
  }

  async searchPosts(query: string): Promise<Post[]> {
    // Search for posts matching the query string
    const result = await this.client.search({
      index: this.indexName,
      query: {
        multi_match: {
          query,
          fields: ["title^2", "content"],
        },
      },
    });

    return result.hits.hits.map((hit: any) => hit._source as Post);
  }

  async deletePost(id: string): Promise<void> {
    // Delete a post document from Elasticsearch by its ID
    await this.client.delete({
      index: this.indexName,
      id,
    });
  }
}
