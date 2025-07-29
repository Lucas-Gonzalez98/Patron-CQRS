package com.cqrs.patroncqrs.query.controller;

import com.cqrs.patroncqrs.query.dto.CategoriaDTO;
import com.cqrs.patroncqrs.query.service.CategoriaQueryService;
import com.cqrs.patroncqrs.query.service.impl.CategoriaQueryServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.Parameter;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categorias/queries")
@CrossOrigin(origins = "*")
@Tag(name = "Consultas de Categorías", description = "Operaciones de lectura de categorías")
public class CategoriaQueryController {

    private final CategoriaQueryService queryService;
    private final CategoriaQueryServiceImpl queryServiceImpl; // Para métodos específicos

    @Autowired
    public CategoriaQueryController(CategoriaQueryService queryService,
                                    CategoriaQueryServiceImpl queryServiceImpl) {
        this.queryService = queryService;
        this.queryServiceImpl = queryServiceImpl;
    }

    @GetMapping
    @Operation(summary = "Obtener todas las categorías")
    public ResponseEntity<List<CategoriaDTO>> obtenerTodasLasCategorias() {
        List<CategoriaDTO> categorias = queryService.obtenerTodasLasCategorias();
        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener categoría por ID")
    public ResponseEntity<?> obtenerCategoriaPorId(@Parameter(description = "ID de la categoría") @PathVariable Long id) {
        Optional<CategoriaDTO> categoria = queryService.obtenerCategoriaPorId(id);
        if (categoria.isPresent()) {
            return ResponseEntity.ok(categoria.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar categorías por nombre")
    public ResponseEntity<List<CategoriaDTO>> buscarCategoriasPorNombre(@Parameter(description = "Nombre de la categoría") @RequestParam String nombre) {
        List<CategoriaDTO> categorias = queryService.buscarCategoriasPorNombre(nombre);
        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/estadisticas")
    @Operation(summary = "Obtener categorías con estadísticas de productos")
    public ResponseEntity<List<CategoriaDTO>> obtenerCategoriasConEstadisticas() {
        List<CategoriaDTO> categorias = queryService.obtenerCategoriasConConteoProductos();
        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/eliminadas")
    @Operation(summary = "Obtener categorías eliminadas")
    public ResponseEntity<List<CategoriaDTO>> obtenerCategoriasEliminadas() {
        List<CategoriaDTO> categorias = queryService.obtenerCategoriasEliminadas();
        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/con-estado")
    @Operation(summary = "Obtener categorías con su estado actual")
    public ResponseEntity<List<CategoriaDTO>> obtenerCategoriasConEstado() {
        List<CategoriaDTO> categorias = queryServiceImpl.obtenerCategoriasConEstado();
        return ResponseEntity.ok(categorias);
    }
}
