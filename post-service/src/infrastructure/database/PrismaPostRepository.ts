import { PrismaClient } from "@prisma/client";
import {
  CreatePostInput,
  Post,
  UpdatePostInput,
} from "../../domain/entities/Post";

export class PrismaPostRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreatePostInput): Promise<Post> {
    return this.prisma.post.create({ data });
  }

  async findById(id: string): Promise<Post | null> {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async findByAuthorId(authorId: string): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: { authorId },
      orderBy: { createdAt: "desc" },
    });
  }

  async update(id: string, data: UpdatePostInput): Promise<Post> {
    return this.prisma.post.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.post.delete({ where: { id } });
  }
}
