import { UpdateUserInput } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IEventPublisher } from "../../domain/services/IEventPublisher";

export class UpdateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private eventPublisher: IEventPublisher
  ) {}

  async execute(userId: string, input: UpdateUserInput) {
    const userExists = await this.userRepository.findById(userId);
    if (!userExists) {
      throw new Error("User not found");
    }
    const user = await this.userRepository.update(userExists.id, input);

    // Publish an event after the user is updated
    await this.eventPublisher.publish("user.updated", {
      userId: user.id,
      name: user.name,
      updatedAt: user.updatedAt,
    });

    return user;
  }
}
