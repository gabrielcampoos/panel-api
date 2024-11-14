import { Result, ResultDto } from "../../../shared/utils";
import { UserRepository } from "../repository";

export class FetchUserUsecase {
  async execute(cpf: string): Promise<ResultDto> {
    const userRepository = new UserRepository();

    const userFromDB = await userRepository.checkIfUserExistsByCpf(cpf);

    if (!userFromDB) return Result.error(400, "Usuário não encontrado.");

    return Result.success(200, "Usuário encontrado.", userFromDB.toJson());
  }
}
