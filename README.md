# 🧠 Patrón CQRS - Command Query Responsibility Segregation

## 📚 Índice

1. [¿Qué es CQRS?](#qué-es-cqrs)
2. [¿Por qué usar CQRS?](#por-qué-usar-cqrs)
3. [Ventajas](#ventajas)
4. [Desventajas](#desventajas)
5. [Mi implementación: CRUD con CQRS](#mi-implementación-crud-con-cqrs)
6. [Estructura del Proyecto](#estructura-del-proyecto)
7. [Backend - Spring Boot con CQRS](#backend-spring-boot-con-cqrs)
8. [Frontend (React + TypeScript)](#frontend-react--typescript)
9. [Conclusión](#conclusión)

---

## ¿Qué es CQRS?

**CQRS** significa _Command Query Responsibility Segregation_ (Separación de Responsabilidades de Comando y Consulta).  
Es un patrón arquitectónico que propone dividir las operaciones de **lectura** y **escritura** de una aplicación en modelos distintos.

Tradicionalmente, una misma clase o componente maneja tanto la lectura como la escritura de datos (por ejemplo, un `Service` o `Controller` en un CRUD clásico).  
Con CQRS, separamos:

- **Commands**: modifican el estado del sistema (crear, actualizar, eliminar).
- **Queries**: consultan información (listar, buscar por filtros o ID).

Esta separación permite escalar cada lado de manera independiente, optimizar las consultas o comandos según necesidades específicas, y tener un sistema más mantenible y robusto en contextos complejos.

---

## ¿Por qué usar CQRS?

El patrón CQRS es útil en escenarios donde:

- El dominio del negocio es complejo.
- Se requiere escalar las lecturas y escrituras de forma separada.
- Hay distintos requerimientos de rendimiento para consultas vs. comandos.
- Se desea una arquitectura alineada con DDD (Domain-Driven Design) o Event Sourcing.

> 🔁 En sistemas simples no siempre vale la pena aplicar CQRS, pero es una gran opción para preparar la arquitectura hacia una evolución a largo plazo.

---

## Ventajas

✅ **Separación de responsabilidades clara**  
✅ **Escalabilidad independiente para consultas y comandos**  
✅ **Modelos optimizados según el tipo de operación**  
✅ **Facilita pruebas unitarias y mantenimiento**  
✅ **Permite adaptar distintas tecnologías para Queries y Commands si es necesario**

---

## Desventajas

⚠️ **Mayor complejidad en la estructura del proyecto**  
⚠️ **Más capas, más clases y más código que mantener**  
⚠️ **Dificultad para sincronizar si se usa almacenamiento separado**  
⚠️ **Overengineering si el dominio es simple o el equipo no está familiarizado con el patrón**

---

## Mi implementación: CRUD con CQRS

Para entender y aplicar CQRS, realicé un ejemplo completo de un **CRUD** utilizando este patrón.

El sistema consiste en una gestión de productos y categorías para un supermercado, con separación clara entre los módulos de **Commands** (crear, actualizar, eliminar) y **Queries** (listar, obtener por ID).

Este ejemplo busca ser didáctico, mostrando cómo organizar un proyecto real aplicando CQRS tanto en el **backend (Spring Boot)** como en el **frontend (React + TypeScript)**.

---

## Estructura del Proyecto

### 🗂️ Estructura del Backend (/backend/src)

```
📁 src
├── 📁 command
│   ├── 📁 controller
│   │   ├── 📄 ProductoCommandController.java
│   │   └── 📄 CategoriaCommandController.java
│   ├── 📁 service
│   │   ├── 📄 ProductoCommandService.java
│   │   ├── 📄 CategoriaCommandService.java
│   │   └── 📁 impl
│   │       ├── 📄 ProductoCommandServiceImpl.java
│   │       └── 📄 CategoriaCommandServiceImpl.java
│   ├── 📁 dto
│   │   ├── 📄 CrearProductoCommand.java
│   │   └── 📄 CrearCategoriaCommand.java
│   └── 📁 mapper
│       ├── 📄 ProductoCommandMapper.java
│       └── 📄 CategoriaCommandMapper.java
│
├── 📁 query
│   ├── 📁 controller
│   │   ├── 📄 ProductoQueryController.java
│   │   └── 📄 CategoriaQueryController.java
│   ├── 📁 service
│   │   ├── 📄 ProductoQueryService.java
│   │   └── 📄 CategoriaQueryService.java
│   │   └── 📁 impl
│   │       ├── 📄 ProductoQueryServiceImpl.java
│   │       └── 📄 CategoriaQueryServiceImpl.java
│   ├── 📁 dto
│   │   ├── 📄 ProductoDTO.java
│   │   └── 📄 CategoriaDTO.java
│   └── 📁 mapper
│       ├── 📄 ProductoQueryMapper.java
│       └── 📄 CategoriaQueryMapper.java
│
├── 📁 domain
│   └── 📁 entity
│       ├── 📄 Producto.java
│       └── 📄 Categoria.java
│
└── 📁 repository
    ├── 📄 ProductoRepository.java
    └── 📄 CategoriaRepository.java

```

### 💻 Estructura del Frontend (/frontend/src)

```
📁 src
├── 📁 components
│   ├── 📁 productos
│   │   ├── 📄 ProductoForm.tsx
│   │   └── 📄 ProductoList.tsx
│   │
│   └── 📁 categorias
│       ├── 📄 CategoriaForm.tsx
│       └── 📄 CategoriaList.tsx
│
├── 📁 pages
│   ├── 📄 ProductosPage.tsx
│   └── 📄 CategoriasPage.tsx
│
├── 📁 services
│   ├── 📄 productoQueryService.ts
│   ├── 📄 productoCommandService.ts
│   ├── 📄 categoriaQueryService.ts
│   └── 📄 categoriaCommandService.ts
│
├── 📁 types
│   ├── 📄 ProductoDTO.ts
│   ├── 📄 CrearProductoCommand.ts
│   ├── 📄 CategoriaDTO.ts
│   └── 📄 CrearCategoriaCommand.ts
│
├── 📄 App.tsx
└── 📄 main.tsx
```

---

## ⚙️ Backend - Spring Boot con CQRS

Backend desarrollado en Java con Spring Boot, aplicando el patrón CQRS (Command Query Responsibility Segregation) para separar claramente la lógica de escritura (Command) y lectura (Query).

### 📝 1. Command: Lógica de Escritura

Esta carpeta contiene toda la lógica encargada de modificar el estado del sistema, como crear, actualizar, eliminar o restaurar entidades (`Producto`, `Categoria`).

#### 🧩 Estructura:

**`controller/`**

  Expone endpoints HTTP para operaciones de escritura.  
  Ejemplos:
  - `ProductoCommandController.java`
  - `CategoriaCommandController.java`


  ``` java
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
```

**`service/`** e **`impl/`**

Define las interfaces para las operaciones de negocio y contiene la lógica de negocio concreta. Incluye validaciones, reglas, y llamadas a repositorios.
 
``` java
// Interface
public interface ProductoCommandService {
    Long crearProducto(CrearProductoCommand command);
    void actualizarProducto(Long id, CrearProductoCommand command);
    void eliminarProducto(Long id);
    void restaurarProducto(Long id);
}

// Implementación
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
```

**`dto/`**

Contiene los objetos de transferencia de datos para comandos.



``` java
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CrearProductoCommand {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;

    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    @Digits(integer = 10, fraction = 2, message = "El precio debe tener máximo 10 dígitos enteros y 2 decimales")
    private Double precio;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    @NotNull(message = "La categoría es obligatoria")
    private Long categoriaId;
}
```


**`mapper/`**

Convierte DTOs en entidades usando MapStruct.


``` java
@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface ProductoCommandMapper {

    /**
     * Convierte un Command a una entidad Producto nueva
     * @param command El comando con los datos del producto
     * @param categoria La categoría asociada al producto
     * @return Nueva entidad Producto
     */
    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "categoria", source = "categoria"),
            @Mapping(target = "eliminado", constant = "false"),
            @Mapping(target = "nombre", source = "command.nombre"),
            @Mapping(target = "descripcion", source = "command.descripcion"),
            @Mapping(target = "precio", source = "command.precio"),
            @Mapping(target = "stock", source = "command.stock")
    })
    Producto toEntity(CrearProductoCommand command, Categoria categoria);

    /**
     * Actualiza una entidad Producto existente con los datos del command
     * @param producto La entidad existente a actualizar
     * @param command El comando con los nuevos datos
     * @param categoria La nueva categoría (puede ser la misma)
     */
    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "categoria", source = "categoria"),
            @Mapping(target = "eliminado", ignore = true),
            @Mapping(target = "nombre", source = "command.nombre"),
            @Mapping(target = "descripcion", source = "command.descripcion"),
            @Mapping(target = "precio", source = "command.precio"),
            @Mapping(target = "stock", source = "command.stock")
    })
    void updateEntity(@MappingTarget Producto producto, CrearProductoCommand command, Categoria categoria);

    /**
     * Mapeo personalizado para crear producto con validaciones
     */
    @Named("toEntityWithValidation")
    default Producto toEntityWithValidation(CrearProductoCommand command, Categoria categoria) {
        if (command == null) {
            return null;
        }

        Producto producto = toEntity(command, categoria);

        // Validaciones adicionales si son necesarias
        if (producto.getPrecio() != null && producto.getPrecio() <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a cero");
        }

        if (producto.getStock() != null && producto.getStock() < 0) {
            throw new IllegalArgumentException("El stock no puede ser negativo");
        }

        return producto;
    }
}

```


#### ✅ Responsabilidades:


- **Alterar el estado del sistema**
- **Validar reglas de negocio**
- **Nunca retorna objetos complejos**
- **Solo devuelve códigos de estado HTTP**


### 📖 2. Query: Lógica de Lectura

Contiene toda la lógica encargada de **consultar información del sistema sin modificarla.**

#### 🧩 Estructura:

**`controller/`**

Expone endpoints de solo lectura.

``` java
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
```

**`service/`** e **`impl/`**

Define e implementa los métodos de consulta (búsquedas por nombre, precio, estado, etc.).

``` java
// Interface
public interface ProductoQueryService {
    List<ProductoDTO> obtenerTodosLosProductos();
    Optional<ProductoDTO> obtenerProductoPorId(Long id);
    List<ProductoDTO> buscarProductosPorNombre(String nombre);
    List<ProductoDTO> obtenerProductosPorCategoria(Long categoriaId);
    List<ProductoDTO> obtenerProductosPorRangoPrecio(Double precioMin, Double precioMax);
    List<ProductoDTO> obtenerProductosEnStock(Integer stockMinimo);
    List<ProductoDTO> obtenerProductosEliminados();
}

// Implemetación

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
```

**`dto/`**

Objetos de retorno optimizados para el frontend.


``` java
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private String categoriaNombre;
    private Long categoriaId;
    private Boolean eliminado;

    private String stockStatus;
    private String precioFormateado;
}
```

**`mapper/`**

Transforma entidades a DTOs enriquecidos.

``` java
@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface ProductoQueryMapper {

    // Mapeo básico
    @Mapping(target = "categoriaNombre", source = "categoria.nombre")
    @Mapping(target = "categoriaId", source = "categoria.id")
    @Mapping(target = "stockStatus", ignore = true)
    @Mapping(target = "precioFormateado", ignore = true)
    ProductoDTO toDTO(Producto producto);

    List<ProductoDTO> toDTOList(List<Producto> productos);

    @Named("toDTOWithExtraInfo")
    @Mapping(target = "categoriaNombre", source = "categoria.nombre")
    @Mapping(target = "categoriaId", source = "categoria.id")
    @Mapping(target = "stockStatus", expression = "java(mapStockStatus(producto.getStock()))")
    @Mapping(target = "precioFormateado", ignore = true)
    ProductoDTO toDTOWithExtraInfo(Producto producto);

    @Named("toDTOWithFormattedPrice")
    @Mapping(target = "categoriaNombre", source = "categoria.nombre")
    @Mapping(target = "categoriaId", source = "categoria.id")
    @Mapping(target = "stockStatus", ignore = true)
    @Mapping(target = "precioFormateado", expression = "java(formatPrice(producto.getPrecio()))")
    ProductoDTO toDTOWithFormattedPrice(Producto producto);

    // Métodos auxiliares
    default String mapStockStatus(Integer stock) {
        if (stock == null) return "DESCONOCIDO";
        if (stock == 0) return "SIN_STOCK";
        if (stock <= 7) return "STOCK_BAJO";
        if (stock <= 30) return "STOCK_MEDIO";
        return "STOCK_ALTO";
    }

    default String formatPrice(Double precio) {
        if (precio == null) return "N/A";
        return String.format("$%.2f", precio);
    }
}
```

#### ✅ Responsabilidades:

    - **Retornar datos de forma clara y eficiente**
    - **Nunca modifica el estado del sistema**
    - **Optimizada para consultas específicas**
    - **DTOs enriquecidos para el frontend**  


### 🏛️ 3. Domain/Entity: Modelo de Dominio

Contiene las entidades persistentes de la aplicación, **compartidas entre ambos contextos** (command y query).

**Producto.java**

``` java
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "productos")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;
    private String descripcion;
    private Double precio;

    @Column(nullable = false)
    private Integer stock;

    @Column(name = "eliminado", nullable = false)
    private Boolean eliminado = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;
}
```

**Categoria.java**

``` java
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "categorias")
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;
    private String descripcion;

    @Column(name = "eliminado", nullable = false)
    private Boolean eliminado = false;

}
```

### 💾 4. Repository: Acceso a Datos

Define las interfaces que extienden de `JpaRepository`. Son **utilizadas por ambos contextos.**

**ProductoRepository.java**

``` java
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
```
**CategoriaRepository.java**

``` java
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
```


### 🛠️ Tecnologías y Buenas Prácticas Utilizadas

**✅ Stack Tecnológico **
    - Spring Boot 3+
    - JPA + Hibernate
    - MapStruct para transformación DTOs ↔ entidades
    - Bean Validation con @Valid, @NotBlank, @NotNull
    - Lombok para reducir boilerplate
    - H2/MySQL para persistencia

**✅ Patrones y Prácticas**
    - Separación estricta entre lectura y escritura
    - Uso de @Transactional para operaciones críticas
    - Manejo manual de soft delete (sin @SQLDelete ni @Where)
    - Control de errores centralizado con @ControllerAdvice
    - DTOs específicos para cada contexto
    - Validaciones robustas en Commands
    - Consultas optimizadas en Queries

**❌ Decisiones de Diseño**
    - No se utiliza @SQLDelete ni @Where para soft delete automático
    - Las bajas lógicas se manejan manualmente con el campo eliminado
    - Repositorios compartidos entre Commands y Queries
    - Entidades compartidas (no hay separación física de modelos)


### 🔧 Configuración

**application.properties**

```properties
spring.application.name=patroncqrs

# --- conexion a la base de datos ---
spring.datasource.url=jdbc:mysql://localhost:3306/patroncqrs?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=America/Argentina/Buenos_Aires
spring.datasource.username=root
spring.datasource.password=
#Fecha
spring.jackson.time-zone=America/Argentina/Buenos_Aires

# Dialecto y driver
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Mostrar consultas en consola (opcional para debug)
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false


# Hibernate crea las tablas automaticamente
spring.jpa.hibernate.ddl-auto=update

# Configuración de logging
logging.level.org.hibernate.SQL=OFF
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=OFF
logging.level.org.hibernate.type.descriptor.sql.BasicExtractor=OFF
logging.level.org.hibernate.orm.jdbc.bind=OFF
logging.level.org.hibernate.orm.jdbc.extract=OFF
logging.level.org.hibernate=INFO
```


**Dependencias principales (pom.xml)** 

```gradle.build
dependencies {
    // Spring Boot starters
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-validation'

    // MySQL driver
    runtimeOnly 'com.mysql:mysql-connector-j'

    // Swagger
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.9'


    // Lombok
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'

    // MapStruct
    implementation 'org.mapstruct:mapstruct:1.5.5.Final'
    annotationProcessor 'org.mapstruct:mapstruct-processor:1.5.5.Final'

    // Testing
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
    
}
```

### 4. Build y ejecución

```bash
./gradlew build
./gradlew bootRun
```

### 5. Carga de datos

Ejecutar los siguientes scripts SQL en orden:

- `script_datos1.sql`




### 🎯 Conclusión BackEnd

Esta implementación de** CQRS con Spring Boot** demuestra cómo separar claramente las responsabilidades de **escritura** y **lectura** en una aplicación real.

**🔑 Puntos Clave:**

    - **Separación clara** entre Commands y Queries
    - **Reutilización** de entidades y repositorios
    - **Optimización específica** para cada tipo de operación
    - **Escalabilidad** preparada para crecimiento futuro
    - **Mantenibilidad** mejorada através de la organización modular

El patrón CQRS aporta **claridad arquitectónica** y prepara la aplicación para evoluciones futuras como Event Sourcing, diferentes bases de datos para lectura/escritura, o microservicios especializados.

---

## 💻 Frontend (React + TypeScript)

🖥️ El frontend de esta aplicación está desarrollado con **React** y **TypeScript**, manteniendo una clara separación de responsabilidades inspirada en el patrón **CQRS (Command Query Responsibility Segregation)**, tal como se aplicó en el backend con Spring Boot.

Esta separación permite manejar de forma organizada y mantenible tanto las operaciones de **lectura** (consultas) como las de **escritura** (creación, modificación y baja) de productos y categorías.

### 🚀 Principales funcionalidades

    - ✅ **Servicios separados para Commands y Queries**

        Cada entidad (Producto y Categoría) tiene dos servicios: uno para las consultas (`QueryService`) y otro para las modificaciones (`CommandService`). Esto permite respetar la separación CQRS incluso desde el frontend:

        ```ts
            // Ejemplo - productoQueryService.ts
            export const obtenerProductos = () =>
            axios.get<ProductoDTO[]>('/api/productos/queries');

            // Ejemplo - productoCommandService.ts
            export const crearProducto = (producto: CrearProductoCommand) =>
            axios.post('/api/productos/commands', producto);
        ```
    
    - 🧩 **Componentes**

        Cada entidad tiene componentes separados para formularios (`Form.tsx`) y listados (`List.tsx`). Los formularios permiten tanto creación como edición, reutilizando el mismo código.
    
    🎨 **Estilos modernos y consistentes**

        - Se utiliza `styled-components` para estilos personalizados con tipado en TypeScript.

        - Se integra `React-Bootstrap` para componentes de UI rápidos y responsivos.

    - 🧠** Definición clara de tipos**

        Todo se tipa estrictamente usando interfaces:
        Por ejemplo, `ProductoDTO.ts` para lectura y `CrearProductoCommand.ts` para escritura. Esto garantiza seguridad de tipo y coherencia con el backend.

    - **Modales para edición inline**

        Las acciones de crear, editar o dar de baja productos y categorías se realizan mediante modales, sin necesidad de navegar a otras páginas. Esto mejora la UX manteniendo todo en el mismo contexto visual.

### ⚙️ Instalación y ejecución

#### Prerrequisitos

- Node.js 18+
- npm

#### Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/buen-sabor-frontend.git
cd buen-sabor-frontend
npm install
```

#### Correr el proyecto

```bash
npm run dev
```

👉 Disponible en: [http://localhost:5173](http://localhost:5173)

#### Otros scripts útiles

```bash
npm run build       # Generar versión de producción
npm run preview     # Previsualizar build
npm run lint        # Linting
```


### 📌 Objetivo del frontend

- Mantener la coherencia con la estructura CQRS implementada en el backend.
- Garantizar una experiencia de usuario clara, fluida y mantenible.
- Separar correctamente la lógica de lectura y escritura también en el cliente.

Este enfoque modular y desacoplado permite escalar fácilmente la aplicación, agregar validaciones complejas y realizar pruebas más controladas por cada flujo (consulta y comando).

---

## Conclusión

El patrón **CQRS** puede parecer complejo al principio, pero brinda muchas ventajas en proyectos medianos o grandes.  
Aplicarlo en este CRUD me permitió entender y demostrar cómo separar responsabilidades, mantener un código más organizado y pensar en escalabilidad futura.

✍️ **Este proyecto fue realizado con fines educativos** y puede servir como base para desarrollos más avanzados con CQRS.

---


