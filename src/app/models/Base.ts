export abstract class Base {
  constructor(protected _id: string) {}

  public toJson() {
    // a lógica de execução vai ficar nas subclasses.
  }
}
