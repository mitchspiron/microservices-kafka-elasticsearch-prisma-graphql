import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { LoginInput } from "../../domain/entities/User";

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtSecret: string
  ) {}

  async execute(input: LoginInput) {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error("Email not found");
    }

    const isPasswordValid = await bcryptjs.compare(
      input.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

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
