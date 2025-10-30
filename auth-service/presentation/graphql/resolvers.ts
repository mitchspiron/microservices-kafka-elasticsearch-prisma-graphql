import { LoginUseCase } from "../../application/usecases/LoginUseCase";
import { RegisterUseCase } from "../../application/usecases/RegisterUseCase";

export const createResolvers = (
  registerUseCase: RegisterUseCase,
  loginUseCase: LoginUseCase
) => ({
  Query: {
    _empty: () => "Auth Service is running",
  },
  Mutation: {
    register: async (_: any, args: { input: any }) => {
      return await registerUseCase.execute(args.input);
    },
    login: async (_: any, args: { input: any }) => {
      return await loginUseCase.execute(args.input);
    },
  },
});
