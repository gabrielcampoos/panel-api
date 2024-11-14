import { CacheRepository } from "../../../shared/cache/cache.repository";
import { Result, ResultDto } from "../../../shared/utils";
import { EditUserDto } from "../dto";
import { UserRepository } from "../repository";

const CACHE_PREFIX = "list-all-users";

export class EditUserUsecase {
  async execute(data: EditUserDto): Promise<ResultDto> {
    const { cpf, newData } = data;

    const usersRepository = new UserRepository();
    const cacheRepository = new CacheRepository();

    const userExists = await usersRepository.checkIfUserExistsByCpf(cpf);

    if (!userExists) {
      return Result.error(400, "Usuário não encontrado.");
    }

    const updatedUser = await usersRepository.editUser({
      cpf,
      name: newData.name,
      password: newData.password,
      role: newData.role,
      active: newData.active,
      accessExpiration: newData.accessExpiration,
    });

    if (!updatedUser) {
      return Result.error(400, "Não foi possível editar o usuário.");
    }

    await cacheRepository.delete(CACHE_PREFIX);

    const usersFromDB = await usersRepository.listUsers();
    const updatedUsersCache = usersFromDB.map((user) => user.toJson());

    await cacheRepository.set(CACHE_PREFIX, updatedUsersCache);

    return Result.success(
      200,
      "Usuário editado com sucesso.",
      updatedUser.toJson()
    );
  }
}
