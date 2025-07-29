package com.cqrs.patroncqrs.command.controller;

import com.cqrs.patroncqrs.command.dto.CrearCategoriaCommand;
import com.cqrs.patroncqrs.command.service.CategoriaCommandService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categorias/commands")
@CrossOrigin(origins = "*")
@Tag(name = "Comandos de Categorías", description = "Operaciones de creación, actualización, eliminación y restauración de categorías")
public class CategoriaCommandController {

    private final CategoriaCommandService commandService;

    @Autowired
    public CategoriaCommandController(CategoriaCommandService commandService) {
        this.commandService = commandService;
    }

    @PostMapping
    @Operation(summary = "Crear una nueva categoría")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Categoría creada correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    public ResponseEntity<Long> crearCategoria(@Valid @RequestBody CrearCategoriaCommand command) {
        try {
            Long categoriaId = commandService.crearCategoria(command);
            return ResponseEntity.status(201).body(categoriaId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar una categoría existente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categoría actualizada correctamente"),
            @ApiResponse(responseCode = "400", description = "Error al actualizar la categoría")
    })
    public ResponseEntity<Void> actualizarCategoria(
            @Parameter(description = "ID de la categoría", required = true) @PathVariable Long id,
            @Valid @RequestBody CrearCategoriaCommand command) {
        try {
            commandService.actualizarCategoria(id, command);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar lógicamente una categoría")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Categoría eliminada correctamente"),
            @ApiResponse(responseCode = "400", description = "Error al eliminar la categoría")
    })
    public ResponseEntity<Void> eliminarCategoria(
            @Parameter(description = "ID de la categoría", required = true) @PathVariable Long id) {
        try {
            commandService.eliminarCategoria(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/restaurar/{id}")
    @Operation(summary = "Restaurar una categoría eliminada")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categoría restaurada correctamente"),
            @ApiResponse(responseCode = "400", description = "Error al restaurar la categoría")
    })
    public ResponseEntity<Void> restaurarCategoria(
            @Parameter(description = "ID de la categoría", required = true) @PathVariable Long id) {
        try {
            commandService.restaurarCategoria(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
