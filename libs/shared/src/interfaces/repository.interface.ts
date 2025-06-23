export interface IRepository<T> {
  create(createDto: any): Promise<T>;
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  update(id: string, updateDto: any): Promise<T | null>;
  delete(id: string): Promise<T | null>;
}
