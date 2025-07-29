package com.cqrs.patroncqrs.query.mapper;

import com.cqrs.patroncqrs.domain.entity.Producto;
import com.cqrs.patroncqrs.query.dto.ProductoDTO;
import org.mapstruct.*;

import java.util.List;

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

