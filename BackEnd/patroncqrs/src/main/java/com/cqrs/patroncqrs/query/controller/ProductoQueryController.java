package com.cqrs.patroncqrs.query.controller;

import com.cqrs.patroncqrs.query.dto.ProductoDTO;
import com.cqrs.patroncqrs.query.service.ProductoQueryService;
import com.cqrs.patroncqrs.query.service.impl.ProductoQueryServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;

import java.util.*;

@RestController
@RequestMapping("/api/productos/queries")
@CrossOrigin(origins = "*")
@Tag(name = "Consultas de Productos", description = "Operaciones de lectura de productos")
public class ProductoQueryController {

    private final ProductoQueryService queryService;
    private final ProductoQueryServiceImpl queryServiceImpl; // Para métodos específicos

    @Autowired
    public ProductoQueryController(ProductoQueryService queryService,
                                   ProductoQueryServiceImpl queryServiceImpl) {
        this.queryService = queryService;
        this.queryServiceImpl = queryServiceImpl;
    }

    @GetMapping
    @Operation(summary = "Obtener todos los productos")
    public ResponseEntity<List<ProductoDTO>> obtenerTodosLosProductos() {
        List<ProductoDTO> productos = queryService.obtenerTodosLosProductos();
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener producto por ID")
    public ResponseEntity<?> obtenerProductoPorId(@Parameter(description = "ID del producto") @PathVariable Long id) {
        Optional<ProductoDTO> producto = queryService.obtenerProductoPorId(id);
        if (producto.isPresent()) {
            return ResponseEntity.ok(producto.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar productos por nombre")
    public ResponseEntity<List<ProductoDTO>> buscarProductosPorNombre(@Parameter(description = "Nombre del producto") @RequestParam String nombre) {
        List<ProductoDTO> productos = queryService.buscarProductosPorNombre(nombre);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/categoria/{categoriaId}")
    @Operation(summary = "Obtener productos por categoría")
    public ResponseEntity<List<ProductoDTO>> obtenerProductosPorCategoria(@Parameter(description = "ID de la categoría") @PathVariable Long categoriaId) {
        List<ProductoDTO> productos = queryService.obtenerProductosPorCategoria(categoriaId);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/precio")
    @Operation(summary = "Obtener productos por rango de precio")
    public ResponseEntity<List<ProductoDTO>> obtenerProductosPorRangoPrecio(
            @Parameter(description = "Precio mínimo") @RequestParam Double precioMin,
            @Parameter(description = "Precio máximo") @RequestParam Double precioMax) {
        List<ProductoDTO> productos = queryService.obtenerProductosPorRangoPrecio(precioMin, precioMax);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/stock")
    @Operation(summary = "Obtener productos con stock mínimo")
    public ResponseEntity<List<ProductoDTO>> obtenerProductosEnStock(@Parameter(description = "Stock mínimo") @RequestParam Integer stockMinimo) {
        List<ProductoDTO> productos = queryService.obtenerProductosEnStock(stockMinimo);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/eliminados")
    @Operation(summary = "Obtener productos eliminados")
    public ResponseEntity<List<ProductoDTO>> obtenerProductosEliminados() {
        List<ProductoDTO> productos = queryService.obtenerProductosEliminados();
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/con-estado-stock")
    @Operation(summary = "Obtener productos con estado de stock")
    public ResponseEntity<List<ProductoDTO>> obtenerProductosConEstadoStock() {
        List<ProductoDTO> productos = queryServiceImpl.obtenerProductosConEstadoStock();
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/con-precio-formateado")
    @Operation(summary = "Obtener productos con precio formateado")
    public ResponseEntity<List<ProductoDTO>> obtenerProductosConPrecioFormateado() {
        List<ProductoDTO> productos = queryServiceImpl.obtenerProductosConPrecioFormateado();
        return ResponseEntity.ok(productos);
    }
}
