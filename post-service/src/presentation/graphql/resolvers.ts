import { create } from "domain";
import { CreatePostUseCase } from "../../application/usecases/CreatePostUseCase";
import { GetMyPostsUseCase } from "../../application/usecases/GetMyPostsUseCase";
import { SearchPostsUseCase } from "../../application/usecases/SearchPostsUseCase";

export const createResolvers = (
  createPostUseCase: CreatePostUseCase,
  getMyPostUseCase: GetMyPostsUseCase,
  searchPostsUseCase: SearchPostsUseCase
) => ({
  Query: {
    myPosts: async (_: any, __: any, context: any) => {
      if (!context.userId) {
        throw new Error("Unauthorized");
      }
      return await getMyPostUseCase.execute(context.userId);
    },
    searchPosts: async (_: any, args: { query: string }) => {
      return await searchPostsUseCase.execute(args.query);
    },
  },
  Mutation: {
    createPost: async (_: any, args: { input: any }, context: any) => {
      if (!context.userId) {
        throw new Error("Unauthorized");
      }

      return await createPostUseCase.execute({
        ...args.input,
        authorId: context.userId,
      });
    },
  },
});
