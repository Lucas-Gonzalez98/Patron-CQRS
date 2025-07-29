package com.cqrs.patroncqrs.query.service;

import com.cqrs.patroncqrs.query.dto.CategoriaDTO;

import java.util.*;

public interface CategoriaQueryService {
    List<CategoriaDTO> obtenerTodasLasCategorias();
    Optional<CategoriaDTO> obtenerCategoriaPorId(Long id);
    List<CategoriaDTO> buscarCategoriasPorNombre(String nombre);
    List<CategoriaDTO> obtenerCategoriasConConteoProductos();
    List<CategoriaDTO> obtenerCategoriasEliminadas();
}
