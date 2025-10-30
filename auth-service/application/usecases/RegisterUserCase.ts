import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { CreateUserInput } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IEventPublisher } from "../../domain/services/IEventPublisher";

export class RegisterUserCase {
  constructor(
    private userRepository: IUserRepository,
    private eventPublisher: IEventPublisher,
    private jwtSecret: string
  ) {}

  async execute(input: CreateUserInput) {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcryptjs.hash(input.password, 10);

    const user = await this.userRepository.create({
      ...input,
      password: hashedPassword,
    });

    // Publish user.created event
    await this.eventPublisher.publish("user.created", {
      userId: user.id,
      email: user.email,
      name: user.name,
      createdAd: user.createdAt,
    });

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      this.jwtSecret,
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
