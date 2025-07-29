package com.cqrs.patroncqrs.repository;

import com.cqrs.patroncqrs.domain.entity.Producto;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Buscar por nombre (solo activos)
    @Query("SELECT p FROM Producto p WHERE p.eliminado = false AND LOWER(p.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<Producto> findByNombreContainingIgnoreCase(@Param("nombre") String nombre);

    // Buscar por categoría (solo activos con categoría activa)
    @Query("SELECT p FROM Producto p WHERE p.eliminado = false AND p.categoria.id = :categoriaId AND p.categoria.eliminado = false")
    List<Producto> findByCategoriaId(@Param("categoriaId") Long categoriaId);

    // Buscar por rango de precio (solo activos)
    @Query("SELECT p FROM Producto p WHERE p.eliminado = false AND p.precio BETWEEN :precioMin AND :precioMax")
    List<Producto> findByPrecioBetween(@Param("precioMin") Double precioMin, @Param("precioMax") Double precioMax);

    // Buscar por stock mayor a X (solo activos)
    @Query("SELECT p FROM Producto p WHERE p.eliminado = false AND p.stock > :stock")
    List<Producto> findByStockGreaterThan(@Param("stock") Integer stock);

    // Buscar por ID con categoría (solo activos)
    @Query("SELECT p FROM Producto p JOIN FETCH p.categoria c WHERE p.id = :id AND p.eliminado = false AND c.eliminado = false")
    Optional<Producto> findByIdWithCategoria(@Param("id") Long id);

    // Obtener todos con categoría (solo activos)
    @Query("SELECT p FROM Producto p JOIN FETCH p.categoria c WHERE p.eliminado = false AND c.eliminado = false")
    List<Producto> findAllWithCategoria();

    // Verificar existencia por nombre (solo activos)
    @Query("SELECT COUNT(p) > 0 FROM Producto p WHERE p.eliminado = false AND LOWER(p.nombre) = LOWER(:nombre)")
    boolean existsByNombreIgnoreCase(@Param("nombre") String nombre);

    // Soft delete por ID
    @Modifying
    @Transactional
    @Query("UPDATE Producto p SET p.eliminado = true WHERE p.id = :id")
    void softDeleteById(@Param("id") Long id);

    // Restaurar producto eliminado
    @Modifying
    @Transactional
    @Query("UPDATE Producto p SET p.eliminado = false WHERE p.id = :id")
    void restoreById(@Param("id") Long id);

    // Buscar productos eliminados
    @Query("SELECT p FROM Producto p WHERE p.eliminado = true")
    List<Producto> findAllDeleted();

    // Buscar por ID incluyendo eliminados
    @Query("SELECT p FROM Producto p WHERE p.id = :id")
    Optional<Producto> findByIdIncludingDeleted(@Param("id") Long id);

    // Verificar si existe (incluyendo eliminados)
    @Query("SELECT COUNT(p) > 0 FROM Producto p WHERE p.id = :id")
    boolean existsByIdIncludingDeleted(@Param("id") Long id);

    // Contar productos activos por categoría
    @Query("SELECT COUNT(p) FROM Producto p WHERE p.eliminado = false AND p.categoria.id = :categoriaId AND p.categoria.eliminado = false")
    Long countActiveByCategoriaId(@Param("categoriaId") Long categoriaId);

}
