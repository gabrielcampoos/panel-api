import { bcrypt } from "../../../shared/utils";
import { Result, ResultDto } from "../../../shared/utils/result.helper";
import { CreateUserDto } from "../dto";
import { CacheRepository } from "../../../shared/cache/cache.repository";
import { UserRepository } from "../repository";

const CACHE_PREFIX = "list-all-users";

export class CreateUserUsecase {
  public async execute(data: CreateUserDto): Promise<ResultDto> {
    const usersRepository = new UserRepository();
    const cacheRepository = new CacheRepository();

    const existingUser = await usersRepository.checkIfUserExistsByCpf(data.cpf);
    if (existingUser) return Result.error(400, "User already registered.");

    const hashedPassword = await bcrypt.generateHash(data.password);
    data.password = hashedPassword;

    const newUser = await usersRepository.register(data);

    await cacheRepository.delete(CACHE_PREFIX);

    const usersFromDB = await usersRepository.listUsers();

    const updatedUsersCache = usersFromDB.map((user) => {
      user.checkExpiration();
      return user.toJson();
    });

    await cacheRepository.set(CACHE_PREFIX, updatedUsersCache);

    return Result.success(200, "User successfully created.", newUser.toJson());
  }
}
