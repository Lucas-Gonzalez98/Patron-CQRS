package com.cqrs.patroncqrs.repository;

import com.cqrs.patroncqrs.domain.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    // Buscar por nombre exacto (solo activas)
    @Query("SELECT c FROM Categoria c WHERE c.eliminado = false AND LOWER(c.nombre) = LOWER(:nombre)")
    Optional<Categoria> findByNombreIgnoreCase(@Param("nombre") String nombre);

    // Buscar por nombre parcial (solo activas)
    @Query("SELECT c FROM Categoria c WHERE c.eliminado = false AND LOWER(c.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<Categoria> findByNombreContainingIgnoreCase(@Param("nombre") String nombre);

    // Verificar existencia por nombre (solo activas)
    @Query("SELECT COUNT(c) > 0 FROM Categoria c WHERE c.eliminado = false AND LOWER(c.nombre) = LOWER(:nombre)")
    boolean existsByNombreIgnoreCase(@Param("nombre") String nombre);


    // Soft delete por ID
    @Modifying
    @Transactional
    @Query("UPDATE Categoria c SET c.eliminado = true WHERE c.id = :id")
    void softDeleteById(@Param("id") Long id);

    // Restaurar categoría eliminada
    @Modifying
    @Transactional
    @Query("UPDATE Categoria c SET c.eliminado = false WHERE c.id = :id")
    void restoreById(@Param("id") Long id);

    // Buscar categorías eliminadas
    @Query(value = "SELECT * FROM categorias WHERE eliminado = true", nativeQuery = true)
    List<Categoria> findAllDeleted();

    // Buscar por ID incluyendo eliminadas
    @Query("SELECT c FROM Categoria c WHERE c.id = :id")
    Optional<Categoria> findByIdIncludingDeleted(@Param("id") Long id);

    // Verificar si existe (incluyendo eliminadas)
    @Query("SELECT COUNT(c) > 0 FROM Categoria c WHERE c.id = :id")
    boolean existsByIdIncludingDeleted(@Param("id") Long id);

    // Obtener todas las categorías activas
    @Query("SELECT c FROM Categoria c WHERE c.eliminado = false ORDER BY c.nombre")
    List<Categoria> findAllActive();

    // Verificar si una categoría puede ser eliminada (no tiene productos activos)
    @Query("SELECT COUNT(p) = 0 FROM Producto p WHERE p.categoria.id = :categoriaId AND p.eliminado = false")
    boolean canBeDeleted(@Param("categoriaId") Long categoriaId);

}
