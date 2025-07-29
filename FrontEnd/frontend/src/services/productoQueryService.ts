import axios from 'axios';
import { type ProductoDTO } from '../types/ProductoDTO';

const API_URL = 'http://localhost:8080/api/productos/queries';

const ProductoQueryService = {
  obtenerTodos: (): Promise<ProductoDTO[]> =>
    axios.get(`${API_URL}`).then(res => res.data),

  obtenerPorId: (id: number): Promise<ProductoDTO> =>
    axios.get(`${API_URL}/${id}`).then(res => res.data),

  buscarPorNombre: (nombre: string): Promise<ProductoDTO[]> =>
    axios.get(`${API_URL}/buscar`, { params: { nombre } }).then(res => res.data),

  obtenerPorCategoria: (categoriaId: number): Promise<ProductoDTO[]> =>
    axios.get(`${API_URL}/categoria/${categoriaId}`).then(res => res.data),

  obtenerPorRangoPrecio: (precioMin: number, precioMax: number): Promise<ProductoDTO[]> =>
    axios.get(`${API_URL}/precio`, {
      params: { precioMin, precioMax },
    }).then(res => res.data),

  obtenerEnStock: (stockMinimo: number): Promise<ProductoDTO[]> =>
    axios.get(`${API_URL}/stock`, { params: { stockMinimo } }).then(res => res.data),

  obtenerEliminados: (): Promise<ProductoDTO[]> =>
    axios.get(`${API_URL}/eliminados`).then(res => res.data),

  obtenerConEstadoStock: (): Promise<ProductoDTO[]> =>
    axios.get(`${API_URL}/con-estado-stock`).then(res => res.data),

  obtenerConPrecioFormateado: (): Promise<ProductoDTO[]> =>
    axios.get(`${API_URL}/con-precio-formateado`).then(res => res.data),
};

export default ProductoQueryService;
