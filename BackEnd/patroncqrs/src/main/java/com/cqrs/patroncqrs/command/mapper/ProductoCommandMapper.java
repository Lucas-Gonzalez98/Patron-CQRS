package com.cqrs.patroncqrs.command.mapper;

import com.cqrs.patroncqrs.command.dto.CrearProductoCommand;
import com.cqrs.patroncqrs.domain.entity.Categoria;
import com.cqrs.patroncqrs.domain.entity.Producto;
import org.mapstruct.*;

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
