# 🧠 Patrón CQRS - Command Query Responsibility Segregation

## 📚 Índice

1. [¿Qué es CQRS?](#qué-es-cqrs)
2. [¿Por qué usar CQRS?](#por-qué-usar-cqrs)
3. [Ventajas](#ventajas)
4. [Desventajas](#desventajas)
5. [Mi implementación: CRUD con CQRS](#mi-implementación-crud-con-cqrs)
6. [Estructura del Proyecto](#estructura-del-proyecto)
7. [Backend (Spring Boot)](#backend-spring-boot)
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

### 💻 Estructura del Frontend (/frontend/src)

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

dto/
Contiene los objetos de transferencia de datos para comandos.


mapper/
Convierte DTOs en entidades usando MapStruct.



## Frontend (React + TypeScript)

🖥️ El frontend está hecho en **React con TypeScript**, y también refleja la separación CQRS:

- Llamadas separadas a servicios de **Commands** y **Queries** usando Axios.
- Componentes reutilizables para formularios y grillas.
- Uso de `styled-components` para estilos y Bootstrap para componentes visuales.
- Modal para crear, editar y dar de baja productos y categorías.

> 📌 El frontend está orientado a mantener la coherencia con la estructura CQRS del backend.

---

## Conclusión

El patrón **CQRS** puede parecer complejo al principio, pero brinda muchas ventajas en proyectos medianos o grandes.  
Aplicarlo en este CRUD me permitió entender y demostrar cómo separar responsabilidades, mantener un código más organizado y pensar en escalabilidad futura.

✍️ **Este proyecto fue realizado con fines educativos** y puede servir como base para desarrollos más avanzados con CQRS.

---


