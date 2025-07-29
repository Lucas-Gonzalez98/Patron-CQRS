package com.cqrs.patroncqrs.command.controller;

import com.cqrs.patroncqrs.command.dto.CrearProductoCommand;
import com.cqrs.patroncqrs.command.service.ProductoCommandService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/productos/commands")
@CrossOrigin(origins = "*")
@Tag(name = "Comandos de Productos", description = "Operaciones para crear, actualizar, eliminar y restaurar productos")
public class ProductoCommandController {

    private final ProductoCommandService commandService;

    @Autowired
    public ProductoCommandController(ProductoCommandService commandService) {
        this.commandService = commandService;
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo producto")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Producto creado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    public ResponseEntity<Long> crearProducto(@Valid @RequestBody CrearProductoCommand command) {
        try {
            Long productoId = commandService.crearProducto(command);
            return ResponseEntity.status(HttpStatus.CREATED).body(productoId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un producto existente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Producto actualizado correctamente"),
            @ApiResponse(responseCode = "400", description = "Error al actualizar el producto")
    })
    public ResponseEntity<Void> actualizarProducto(
            @Parameter(description = "ID del producto", required = true) @PathVariable Long id,
            @Valid @RequestBody CrearProductoCommand command) {
        try {
            commandService.actualizarProducto(id, command);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar lógicamente un producto")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Producto eliminado correctamente"),
            @ApiResponse(responseCode = "400", description = "Error al eliminar el producto")
    })
    public ResponseEntity<Void> eliminarProducto(
            @Parameter(description = "ID del producto", required = true) @PathVariable Long id) {
        try {
            commandService.eliminarProducto(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/restaurar/{id}")
    @Operation(summary = "Restaurar un producto eliminado")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Producto restaurado correctamente"),
            @ApiResponse(responseCode = "400", description = "Error al restaurar el producto")
    })
    public ResponseEntity<Void> restaurarProducto(
            @Parameter(description = "ID del producto", required = true) @PathVariable Long id) {
        try {
            commandService.restaurarProducto(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
