import { UpdateUserInput, User } from "../entities/User";

export interface IUserRepository {
  create(data: { id: string; email: string; name: string }): Promise<User>;
  findById(id: string): Promise<User | null>;
  update(id: string, data: UpdateUserInput): Promise<User>;
}
