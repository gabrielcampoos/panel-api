import { bcrypt, jwt } from "../../../shared/utils";
import { Result, ResultDto } from "../../../shared/utils/result.helper";
import { CreateUserDto } from "../dto";
import { UserRepository } from "../repository";

export type LoginUserDto = Omit<
  CreateUserDto,
  "name" | "role" | "active" | "accessExpiration"
>;

export class LoginUserUsecase {
  public async execute(data: LoginUserDto): Promise<ResultDto> {
    const repository = new UserRepository();

    const existingUser = await repository.checkIfUserExistsByCpf(data.cpf);

    if (!existingUser) {
      return Result.error(404, "User not found.");
    }

    const isPasswordValid = await bcrypt.compareHash(
      data.password,
      existingUser.getPassword()
    );

    if (!isPasswordValid) {
      return Result.error(401, "Invalid username or password.");
    }

    const userData = existingUser.toJson();
    const token = jwt.encoded(userData);

    return Result.success(200, "User logged in successfully.", {
      ...userData,
      token,
    });
  }
}
