package com.cqrs.patroncqrs.query.service;

import com.cqrs.patroncqrs.query.dto.ProductoDTO;

import java.util.*;

public interface ProductoQueryService {
    List<ProductoDTO> obtenerTodosLosProductos();
    Optional<ProductoDTO> obtenerProductoPorId(Long id);
    List<ProductoDTO> buscarProductosPorNombre(String nombre);
    List<ProductoDTO> obtenerProductosPorCategoria(Long categoriaId);
    List<ProductoDTO> obtenerProductosPorRangoPrecio(Double precioMin, Double precioMax);
    List<ProductoDTO> obtenerProductosEnStock(Integer stockMinimo);
    List<ProductoDTO> obtenerProductosEliminados();
}
