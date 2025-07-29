import axios from 'axios';
import { type CrearCategoriaCommand } from '../types/CrearCategoriaCommand';

const API_URL = 'http://localhost:8080/api/categorias/commands';

export const crearCategoria = async (categoria: CrearCategoriaCommand): Promise<number> => {
  const response = await axios.post<number>(API_URL, categoria);
  return response.data;
};

export const actualizarCategoria = async (id: number, categoria: CrearCategoriaCommand): Promise<void> => {
  await axios.put(`${API_URL}/${id}`, categoria);
};

export const eliminarCategoria = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

export const restaurarCategoria = async (id: number): Promise<void> => {
  await axios.put(`${API_URL}/restaurar/${id}`);
};
