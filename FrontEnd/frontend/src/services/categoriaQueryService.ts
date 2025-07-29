import axios from 'axios';
import { type CategoriaDTO } from '../types/CategoriaDTO';

const API_URL = 'http://localhost:8080/api/categorias/queries';

const CategoriaQueryService = {
  obtenerTodas: (): Promise<CategoriaDTO[]> =>
    axios.get(`${API_URL}`).then(res => res.data),

  obtenerPorId: (id: number): Promise<CategoriaDTO> =>
    axios.get(`${API_URL}/${id}`).then(res => res.data),

  buscarPorNombre: (nombre: string): Promise<CategoriaDTO[]> =>
    axios.get(`${API_URL}/buscar`, { params: { nombre } }).then(res => res.data),

  obtenerConEstadisticas: (): Promise<CategoriaDTO[]> =>
    axios.get(`${API_URL}/estadisticas`).then(res => res.data),

  obtenerEliminadas: (): Promise<CategoriaDTO[]> =>
    axios.get(`${API_URL}/eliminadas`).then(res => res.data),

  obtenerConEstado: (): Promise<CategoriaDTO[]> =>
    axios.get(`${API_URL}/con-estado`).then(res => res.data),
};

export default CategoriaQueryService;
