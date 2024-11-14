import { Result, ResultDto } from "../../../shared/utils";
import { FileRepository } from "../repository";
import { CacheRepository } from "../../../shared/cache/cache.repository";

const CACHE_PREFIX = "list-all-files";

export class DeleteFileUsecase {
  async execute(id: string): Promise<ResultDto> {
    const fileRepository = new FileRepository();
    const cacheRepository = new CacheRepository();

    const fileExists = await fileRepository.getFileById(id);

    if (!fileExists) {
      return Result.error(400, "File not found.");
    }

    try {
      await fileRepository.deleteFile(id);
    } catch (error) {
      return Result.error(400, "File could not be deleted.");
    }

    const filesFromCache = (await cacheRepository.get(CACHE_PREFIX)) as Array<{
      id: string;
    }>;

    if (!Array.isArray(filesFromCache)) {
      return Result.error(500, "Error retrieving files from cache.");
    }

    const updatedFilesCache = filesFromCache.filter((file) => file.id !== id);

    await cacheRepository.set(CACHE_PREFIX, updatedFilesCache);

    return Result.success(200, "File successfully deleted.", id);
  }
}
