import { DatabaseConnection } from "../../../../main/database/typeorm.connection";
import { File, User } from "../../../models";
import { UserEntity } from "../../../shared/entities";
import { FileEntity } from "../../../shared/entities/file.entity";
import { CreateFileDto, UpdateFileDto } from "../dto";

export class FileRepository {
  private _manager = DatabaseConnection.connection.manager;

  public async createFile(data: CreateFileDto): Promise<File | null> {
    if (!data.userId) {
      throw new Error("User ID is required.");
    }

    const user = await this._manager.findOne(UserEntity, {
      where: { id: data.userId },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const fileToCreate = this._manager.create(FileEntity, { ...data, user });
    const file = await this._manager.save(fileToCreate);

    const savedFile = await this._manager.findOne(FileEntity, {
      where: { id: file.id },
      relations: ["user"],
    });

    if (!savedFile) {
      throw new Error("Failed to retrieve saved file.");
    }

    return this.entityToModel(savedFile);
  }

  public async getFileById(id: string): Promise<File | null> {
    const file = await this._manager.findOne(FileEntity, {
      where: { id },
      relations: ["user"],
    });

    console.log("Resultado da busca:", file);

    return file ? this.entityToModel(file) : null;
  }

  public async listFiles(): Promise<File[]> {
    const files = await this._manager.find(FileEntity, {
      relations: ["user"],
    });

    const fileModels = await Promise.all(
      files.map(this.entityToModel.bind(this))
    );

    return fileModels;
  }

  public async updateFile(
    id: string,
    fileData: UpdateFileDto
  ): Promise<File | null> {
    const result = await this._manager.update(FileEntity, { id }, fileData);
    if (result.affected === 0) {
      return null;
    }

    const updatedFile = await this._manager.findOne(FileEntity, {
      where: { id },
      relations: ["user"],
    });

    return updatedFile ? this.entityToModel(updatedFile) : null;
  }

  public async deleteFile(id: string): Promise<void> {
    const result = await this._manager.delete(FileEntity, { id });
    if (result.affected === 0) {
      throw new Error(`Failed to delete file with ID ${id}`);
    }

    const deletedFile = await this._manager.findOne(FileEntity, {
      where: { id },
      relations: ["user"],
    });

    if (!deletedFile) {
      console.log("File successfully deleted.");
    }
  }

  private async entityToModel(fileEntity: FileEntity): Promise<File> {
    return new File(
      fileEntity.id,
      fileEntity.filename,
      fileEntity.filepath,
      fileEntity.size,
      fileEntity.uploadDate,
      this.userEntityToModel(fileEntity.user)
    );
  }

  private userEntityToModel(dataFromDB: UserEntity): User {
    return new User(
      dataFromDB.id,
      dataFromDB.name,
      dataFromDB.cpf,
      dataFromDB.password,
      dataFromDB.role || "user",
      dataFromDB.active ?? true,
      dataFromDB.accessExpiration
    );
  }
}
