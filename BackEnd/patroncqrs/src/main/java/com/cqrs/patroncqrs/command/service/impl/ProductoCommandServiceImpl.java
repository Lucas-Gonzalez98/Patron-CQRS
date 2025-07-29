package com.cqrs.patroncqrs.command.service.impl;

import com.cqrs.patroncqrs.command.dto.CrearProductoCommand;
import com.cqrs.patroncqrs.command.mapper.ProductoCommandMapper;
import com.cqrs.patroncqrs.command.service.ProductoCommandService;
import com.cqrs.patroncqrs.domain.entity.Categoria;
import com.cqrs.patroncqrs.domain.entity.Producto;
import com.cqrs.patroncqrs.repository.CategoriaRepository;
import com.cqrs.patroncqrs.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProductoCommandServiceImpl implements ProductoCommandService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProductoCommandMapper mapper;

    @Autowired
    public ProductoCommandServiceImpl(ProductoRepository productoRepository,
                                      CategoriaRepository categoriaRepository,
                                      ProductoCommandMapper mapper) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.mapper = mapper;
    }

    @Override
    public Long crearProducto(CrearProductoCommand command) {
        // Validar que la categoría existe y está activa
        Categoria categoria = categoriaRepository.findById(command.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada o eliminada con ID: " + command.getCategoriaId()));

        // Validar que no existe un producto activo con el mismo nombre
        if (productoRepository.existsByNombreIgnoreCase(command.getNombre())) {
            throw new RuntimeException("Ya existe un producto activo con el nombre: " + command.getNombre());
        }

        // Usar MapStruct para crear el producto
        Producto producto = mapper.toEntity(command, categoria);
        Producto productoGuardado = productoRepository.save(producto);

        return productoGuardado.getId();
    }

    @Override
    public void actualizarProducto(Long id, CrearProductoCommand command) {
        // Buscar el producto existente (solo activos)
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado o eliminado con ID: " + id));

        // Validar que la categoría existe y está activa
        Categoria categoria = categoriaRepository.findById(command.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada o eliminada con ID: " + command.getCategoriaId()));

        // Validar que no existe otro producto activo con el mismo nombre
        if (productoRepository.existsByNombreIgnoreCase(command.getNombre()) &&
                !producto.getNombre().equalsIgnoreCase(command.getNombre())) {
            throw new RuntimeException("Ya existe un producto activo con el nombre: " + command.getNombre());
        }

        // Usar MapStruct para actualizar el producto
        mapper.updateEntity(producto, command, categoria);
        productoRepository.save(producto);
    }

    @Override
    public void eliminarProducto(Long id) {
        // Verificar que el producto existe (incluyendo los eliminados para mejor mensaje de error)
        if (!productoRepository.existsByIdIncludingDeleted(id)) {
            throw new RuntimeException("Producto no encontrado con ID: " + id);
        }

        // Verificar que el producto no está ya eliminado
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto ya eliminado con ID: " + id));

        // Realizar soft delete
        productoRepository.softDeleteById(id);
    }

    @Override
    public void restaurarProducto(Long id) {
        // Verificar que el producto existe
        if (!productoRepository.existsByIdIncludingDeleted(id)) {
            throw new RuntimeException("Producto no encontrado con ID: " + id);
        }

        // Buscar el producto incluyendo eliminados
        Producto producto = productoRepository.findByIdIncludingDeleted(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

        // Verificar que está eliminado
        if (!producto.getEliminado()) {
            throw new RuntimeException("El producto con ID: " + id + " no está eliminado");
        }

        // Verificar que la categoría esté activa
        if (producto.getCategoria().getEliminado()) {
            throw new RuntimeException("No se puede restaurar el producto porque su categoría está eliminada");
        }

        // Verificar que no existe otro producto activo con el mismo nombre
        if (productoRepository.existsByNombreIgnoreCase(producto.getNombre())) {
            throw new RuntimeException("Ya existe un producto activo con el nombre: " + producto.getNombre());
        }

        // Restaurar producto
        productoRepository.restoreById(id);
    }

}
