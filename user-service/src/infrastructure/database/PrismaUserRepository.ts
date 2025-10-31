import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UpdateUserInput, User } from "../../domain/entities/User";

export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
