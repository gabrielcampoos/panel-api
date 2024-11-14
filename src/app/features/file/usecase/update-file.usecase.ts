import { Result, ResultDto } from "../../../shared/utils/result.helper";
import { UpdateFileDto } from "../dto";
import { CacheRepository } from "../../../shared/cache/cache.repository";
import { FileRepository } from "../repository";

const CACHE_PREFIX = "list-all-files";

export class UpdateFileUsecase {
  public async execute(id: string, data: UpdateFileDto): Promise<ResultDto> {
    const fileRepository = new FileRepository();
    const cacheRepository = new CacheRepository();

    const existingFile = await fileRepository.getFileById(id);
    if (!existingFile) {
      return Result.error(404, "File not found.");
    }

    const updatedFile = await fileRepository.updateFile(id, data);
    if (!updatedFile) {
      return Result.error(400, "File update failed.");
    }

    await cacheRepository.delete(CACHE_PREFIX);
    const filesFromDB = await fileRepository.listFiles();
    const updatedFilesCache = filesFromDB.map((file) => file.toJson());
    await cacheRepository.set(CACHE_PREFIX, updatedFilesCache);

    return Result.success(
      200,
      "File successfully updated.",
      updatedFile.toJson()
    );
  }
}
