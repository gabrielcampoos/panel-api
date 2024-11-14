import { CacheRepository } from "../../../shared/cache/cache.repository";
import { Result, ResultDto } from "../../../shared/utils/result.helper";
import { UserRepository } from "../repository";

const CACHE_PREFIX = "list-all-users";

export class ListAllUsersUsecase {
  public async execute(): Promise<ResultDto> {
    const repository = new UserRepository();
    const cacheRepository = new CacheRepository();

    const usersFromDB = await repository.listUsers();

    const users = usersFromDB.map((user) => {
      user.checkExpiration();
      return user.toJson();
    });

    await cacheRepository.set(CACHE_PREFIX, users);

    return Result.success(200, "Registered users.", users);
  }
}
