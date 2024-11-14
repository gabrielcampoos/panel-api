import { Result, ResultDto } from "../../../shared/utils";
import { CacheRepository } from "../../../shared/cache/cache.repository";
import { UserRepository } from "../repository";
import { UserJson } from "../../../models";

const CACHE_PREFIX = "list-all-users";

export class DeleteUserUsecase {
  async execute(cpf: string): Promise<ResultDto> {
    const usersRepository = new UserRepository();
    const cacheRepository = new CacheRepository();

    const userExists = await usersRepository.checkIfUserExistsByCpf(cpf);

    if (!userExists) {
      return Result.error(400, "Usuário não encontrado.");
    }

    try {
      await usersRepository.deleteUser(cpf);
    } catch (error) {
      return Result.error(400, "Usuário não pode ser excluído.");
    }

    const usersFromCache =
      (await cacheRepository.get<UserJson[]>(CACHE_PREFIX)) || [];

    const updatedUsersCache = usersFromCache.filter((user) => user.cpf !== cpf);

    await cacheRepository.set(CACHE_PREFIX, updatedUsersCache);

    return Result.success(200, "Usuário excluído com sucesso.", cpf);
  }
}
