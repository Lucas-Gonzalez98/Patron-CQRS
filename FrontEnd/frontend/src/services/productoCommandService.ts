import axios from 'axios';
import {type CrearProductoCommand} from '../types/CrearProductoCommand';

const API_URL = 'http://localhost:8080/api/productos/commands';

export const crearProducto = async (producto: CrearProductoCommand): Promise<number> => {
  const response = await axios.post<number>(API_URL, producto);
  return response.data;
};

export const actualizarProducto = async (id: number, producto: CrearProductoCommand): Promise<void> => {
  await axios.put(`${API_URL}/${id}`, producto);
};

export const eliminarProducto = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

export const restaurarProducto = async (id: number): Promise<void> => {
  await axios.put(`${API_URL}/restaurar/${id}`);
};