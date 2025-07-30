package com.cqrs.patroncqrs.query.service.impl;

import com.cqrs.patroncqrs.query.dto.ProductoDTO;
import com.cqrs.patroncqrs.query.mapper.ProductoQueryMapper;
import com.cqrs.patroncqrs.query.service.ProductoQueryService;
import com.cqrs.patroncqrs.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional(readOnly = true)
public class ProductoQueryServiceImpl implements ProductoQueryService {

    private final ProductoRepository productoRepository;
    private final ProductoQueryMapper mapper;

    @Autowired
    public ProductoQueryServiceImpl(ProductoRepository productoRepository, ProductoQueryMapper mapper) {
        this.productoRepository = productoRepository;
        this.mapper = mapper;
    }

    @Override
    public List<ProductoDTO> obtenerTodosLosProductos() {
        return mapper.toDTOList(productoRepository.findAllWithCategoria());
    }

    @Override
    public Optional<ProductoDTO> obtenerProductoPorId(Long id) {
        return productoRepository.findByIdWithCategoria(id)
                .map(mapper::toDTO);
    }

    @Override
    public List<ProductoDTO> buscarProductosPorNombre(String nombre) {
        return mapper.toDTOList(productoRepository.findByNombreContainingIgnoreCase(nombre));
    }

    @Override
    public List<ProductoDTO> obtenerProductosPorCategoria(Long categoriaId) {
        return mapper.toDTOList(productoRepository.findByCategoriaId(categoriaId));
    }

    @Override
    public List<ProductoDTO> obtenerProductosPorRangoPrecio(Double precioMin, Double precioMax) {
        return mapper.toDTOList(productoRepository.findByPrecioBetween(precioMin, precioMax));
    }

    @Override
    public List<ProductoDTO> obtenerProductosEnStock(Integer stockMinimo) {
        return mapper.toDTOList(productoRepository.findByStockGreaterThan(stockMinimo));
    }

    @Override
    public List<ProductoDTO> obtenerProductosEliminados() {
        return mapper.toDTOList(productoRepository.findAllDeleted());
    }

    public List<ProductoDTO> obtenerProductosConEstadoStock() {
        return productoRepository.findAllWithCategoria().stream()
                .map(mapper::toDTOWithExtraInfo)
                .toList();
    }

    public List<ProductoDTO> obtenerProductosConPrecioFormateado() {
        return productoRepository.findAllWithCategoria().stream()
                .map(mapper::toDTOWithFormattedPrice)
                .toList();
    }
}
