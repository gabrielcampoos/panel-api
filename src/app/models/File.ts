import { Base } from "./Base";
import { User } from "./User";

interface FileJson {
  id: string;
  filename: string;
  filepath: string;
  size: number;
  uploadDate: Date;
  available: boolean;
  userId: string;
}

export class File extends Base {
  public _available: boolean;
  public _uploadDate: Date;

  constructor(
    public _id: string,
    public _filename: string,
    public _filepath: string,
    public _size: number,
    _uploadDate: Date = new Date(),
    public _userId: User
  ) {
    super(_id);
    this._uploadDate = _uploadDate;
    this._available = this._userId.isActive();
  }

  toJson(): FileJson {
    return {
      id: this._id,
      filename: this._filename,
      filepath: this._filepath,
      size: this._size,
      uploadDate: this._uploadDate,
      available: this._available,
      userId: this._userId.getId(),
    };
  }

  getId(): string {
    return this._id;
  }

  setId(id: string): void {
    this._id = id;
  }

  getFilename(): string {
    return this._filename;
  }

  setFilename(filename: string): void {
    this._filename = filename;
  }

  getFilepath(): string {
    return this._filepath;
  }

  setFilepath(filepath: string): void {
    this._filepath = filepath;
  }

  getSize(): number {
    return this._size;
  }

  setSize(size: number): void {
    this._size = size;
  }

  getUploadDate(): Date {
    return this._uploadDate;
  }

  setUploadDate(uploadDate: Date): void {
    this._uploadDate = uploadDate;
  }

  isAvailable(): boolean {
    return this._available && this._userId.isActive();
  }

  setAvailable(available: boolean): void {
    this._available = available;
  }

  getUser(): User {
    return this._userId;
  }

  setUser(user: User): void {
    this._userId = user;
  }
}
