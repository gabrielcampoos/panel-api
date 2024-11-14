import { Result, ResultDto } from "../../../shared/utils";
import { FileRepository } from "../repository";
import { CacheRepository } from "../../../shared/cache/cache.repository";

const CACHE_PREFIX = "list-all-files";

export class ListFilesUsecase {
  async execute(): Promise<ResultDto> {
    const fileRepository = new FileRepository();
    const cacheRepository = new CacheRepository();

    await cacheRepository.delete(CACHE_PREFIX);

    const filesFromCache = (await cacheRepository.get(CACHE_PREFIX)) as Array<{
      id: string;
    }>;

    if (filesFromCache && Array.isArray(filesFromCache)) {
      return Result.success(
        200,
        "Files successfully retrieved from cache.",
        filesFromCache
      );
    }

    try {
      const files = await fileRepository.listFiles();
      const filesJson = files.map((file) => file.toJson());

      await cacheRepository.set(CACHE_PREFIX, filesJson);

      return Result.success(
        200,
        "Files successfully retrieved from database.",
        filesJson
      );
    } catch (error) {
      return Result.error(500, "Error retrieving files.");
    }
  }
}
