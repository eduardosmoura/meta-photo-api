export interface IRepository<T> {
  getById(id: number): Promise<T>;
  getAll?(): Promise<T[]>;
}
