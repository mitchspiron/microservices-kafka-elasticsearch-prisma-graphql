import { GetUserUseCase } from "../../application/usecases/GetUserUseCase";
import { UpdateUserUseCase } from "../../application/usecases/UpdateUserUseCase";

export const createResolvers = (
  getUserUseCase: GetUserUseCase,
  updateUserUseCase: UpdateUserUseCase
) => ({
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (!context.userId) {
        throw new Error("Unauthorized");
      }
      return await getUserUseCase.execute(context.userId);
    },
  },
  Mutation: {
    updateProfile: async (_: any, { input }: any, context: any) => {
      if (!context.userId) {
        throw new Error("Unauthorized");
      }
      return await updateUserUseCase.execute(context.userId, input);
    },
  },
});
