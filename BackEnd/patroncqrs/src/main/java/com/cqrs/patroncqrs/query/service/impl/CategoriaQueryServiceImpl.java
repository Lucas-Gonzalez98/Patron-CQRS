package com.cqrs.patroncqrs.query.service.impl;

import com.cqrs.patroncqrs.query.dto.CategoriaDTO;
import com.cqrs.patroncqrs.query.mapper.CategoriaQueryMapper;
import com.cqrs.patroncqrs.query.service.CategoriaQueryService;
import com.cqrs.patroncqrs.repository.CategoriaRepository;
import com.cqrs.patroncqrs.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CategoriaQueryServiceImpl implements CategoriaQueryService {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;
    private final CategoriaQueryMapper mapper;

    @Autowired
    public CategoriaQueryServiceImpl(CategoriaRepository categoriaRepository,
                                     ProductoRepository productoRepository,
                                     CategoriaQueryMapper mapper) {
        this.categoriaRepository = categoriaRepository;
        this.productoRepository = productoRepository;
        this.mapper = mapper;
    }

    @Override
    public List<CategoriaDTO> obtenerTodasLasCategorias() {
        return mapper.toDTOList(categoriaRepository.findAllActive());
    }

    @Override
    public Optional<CategoriaDTO> obtenerCategoriaPorId(Long id) {
        return categoriaRepository.findById(id)
                .map(mapper::toDTO);
    }

    @Override
    public List<CategoriaDTO> buscarCategoriasPorNombre(String nombre) {
        return mapper.toDTOList(categoriaRepository.findByNombreContainingIgnoreCase(nombre));
    }

    @Override
    public List<CategoriaDTO> obtenerCategoriasConConteoProductos() {
        return categoriaRepository.findAllActive().stream()
                .map(categoria -> {
                    CategoriaDTO dto = mapper.toDTO(categoria);
                    Long conteoProductos = productoRepository.countActiveByCategoriaId(categoria.getId());
                    dto.setCantidadProductos(conteoProductos.intValue());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoriaDTO> obtenerCategoriasEliminadas() {
        return mapper.toDTOList(categoriaRepository.findAllDeleted());
    }

    // Funcion adicional usando mapper con estado
    public List<CategoriaDTO> obtenerCategoriasConEstado() {
        return categoriaRepository.findAllActive().stream()
                .map(categoria -> mapper.toDTOWithStatus(categoria))
                .collect(Collectors.toList());
    }
}
