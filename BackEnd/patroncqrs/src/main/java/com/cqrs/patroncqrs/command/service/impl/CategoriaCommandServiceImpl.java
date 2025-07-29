package com.cqrs.patroncqrs.command.service.impl;

import com.cqrs.patroncqrs.command.dto.CrearCategoriaCommand;
import com.cqrs.patroncqrs.command.mapper.CategoriaCommandMapper;
import com.cqrs.patroncqrs.command.service.CategoriaCommandService;
import com.cqrs.patroncqrs.domain.entity.Categoria;
import com.cqrs.patroncqrs.repository.CategoriaRepository;
import com.cqrs.patroncqrs.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CategoriaCommandServiceImpl implements CategoriaCommandService {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;
    private final CategoriaCommandMapper mapper;

    @Autowired
    public CategoriaCommandServiceImpl(CategoriaRepository categoriaRepository,
                                       ProductoRepository productoRepository,
                                       CategoriaCommandMapper mapper) {
        this.categoriaRepository = categoriaRepository;
        this.productoRepository = productoRepository;
        this.mapper = mapper;
    }

    @Override
    public Long crearCategoria(CrearCategoriaCommand command) {
        // Validar que no existe una categoría activa con el mismo nombre
        if (categoriaRepository.existsByNombreIgnoreCase(command.getNombre())) {
            throw new RuntimeException("Ya existe una categoría activa con el nombre: " + command.getNombre());
        }

        // Usar MapStruct para crear la categoría
        Categoria categoria = mapper.toEntity(command);
        Categoria categoriaGuardada = categoriaRepository.save(categoria);

        return categoriaGuardada.getId();
    }

    @Override
    public void actualizarCategoria(Long id, CrearCategoriaCommand command) {
        // Buscar la categoría existente (solo activas)
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada o eliminada con ID: " + id));

        // Validar que no existe otra categoría activa con el mismo nombre
        if (categoriaRepository.existsByNombreIgnoreCase(command.getNombre()) &&
                !categoria.getNombre().equalsIgnoreCase(command.getNombre())) {
            throw new RuntimeException("Ya existe una categoría activa con el nombre: " + command.getNombre());
        }

        // Usar MapStruct para actualizar la categoría
        mapper.updateEntity(categoria, command);
        categoriaRepository.save(categoria);
    }

    @Override
    public void eliminarCategoria(Long id) {
        // Verificar que la categoría existe (incluyendo eliminadas)
        if (!categoriaRepository.existsByIdIncludingDeleted(id)) {
            throw new RuntimeException("Categoría no encontrada con ID: " + id);
        }

        // Verificar que la categoría no está ya eliminada
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría ya eliminada con ID: " + id));

        // Verificar que no tiene productos activos asociados
        Long productosActivos = productoRepository.countActiveByCategoriaId(id);
        if (productosActivos > 0) {
            throw new RuntimeException("No se puede eliminar la categoría porque tiene " +
                    productosActivos + " productos activos asociados");
        }

        // Realizar soft delete
        categoriaRepository.softDeleteById(id);
    }

    @Override
    public void restaurarCategoria(Long id) {
        // Verificar que la categoría existe
        if (!categoriaRepository.existsByIdIncludingDeleted(id)) {
            throw new RuntimeException("Categoría no encontrada con ID: " + id);
        }

        // Buscar la categoría incluyendo eliminadas
        Categoria categoria = categoriaRepository.findByIdIncludingDeleted(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + id));

        // Verificar que está eliminada
        if (!categoria.getEliminado()) {
            throw new RuntimeException("La categoría con ID: " + id + " no está eliminada");
        }

        // Verificar que no existe otra categoría activa con el mismo nombre
        if (categoriaRepository.existsByNombreIgnoreCase(categoria.getNombre())) {
            throw new RuntimeException("Ya existe una categoría activa con el nombre: " + categoria.getNombre());
        }

        // Restaurar categoría
        categoriaRepository.restoreById(id);
    }
}
