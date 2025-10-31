import { UpdateUserInput, User } from "../entities/User";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  update(id: string, data: UpdateUserInput): Promise<User>;
}
