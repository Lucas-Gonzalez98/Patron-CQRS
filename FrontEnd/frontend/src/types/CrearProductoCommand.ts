export interface CrearProductoCommand {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoriaId: number;
}
