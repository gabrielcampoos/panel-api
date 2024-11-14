import { Result, ResultDto } from "../../../shared/utils/result.helper";
import { CreateFileDto } from "../dto";
import { CacheRepository } from "../../../shared/cache/cache.repository";
import { FileRepository } from "../repository";
import { UserRepository } from "../../user/repository";

const CACHE_PREFIX = "list-all-files";

export class CreateFileUsecase {
  public async execute(data: CreateFileDto): Promise<ResultDto> {
    const fileRepository = new FileRepository();
    const cacheRepository = new CacheRepository();
    const userRepository = new UserRepository();

    const user = await userRepository.checkIfUserExistsById(data.userId);
    if (!user) {
      return Result.error(400, "User not found.");
    }

    const newFile = await fileRepository.createFile(data);

    await cacheRepository.delete(CACHE_PREFIX);

    const filesFromDB = await fileRepository.listFiles();

    const updatedFilesCache = filesFromDB.map((file) => file.toJson());
    await cacheRepository.set(CACHE_PREFIX, updatedFilesCache);

    return Result.success(200, "File successfully created.", newFile?.toJson());
  }
}
