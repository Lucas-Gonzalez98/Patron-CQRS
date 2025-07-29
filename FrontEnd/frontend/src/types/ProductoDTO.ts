export interface ProductoDTO {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoriaNombre: string;
  categoriaId: number;
  eliminado: boolean;

  stockStatus: string;
  precioFormateado: string;
}