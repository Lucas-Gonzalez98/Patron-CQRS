package com.cqrs.patroncqrs.query.mapper;

import com.cqrs.patroncqrs.domain.entity.Categoria;
import com.cqrs.patroncqrs.query.dto.CategoriaDTO;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CategoriaQueryMapper {

    /**
     * Convierte una entidad Categoria a CategoriaDTO
     */
    @Mapping(target = "cantidadProductos", ignore = true)
    @Mapping(target = "estado", ignore = true)
    CategoriaDTO toDTO(Categoria categoria);


    /**
     * Convierte una lista de entidades a DTOs
     */
    List<CategoriaDTO> toDTOList(List<Categoria> categorias);

    /**
     * Mapeo con información de estado
     */
    @Named("toDTOWithStatus")
    @Mapping(target = "cantidadProductos", ignore = true)
    @Mapping(target = "estado", expression = "java(mapEstado(categoria.getEliminado()))")
    CategoriaDTO toDTOWithStatus(Categoria categoria);

    /**
     * Funcion auxiliar para determinar el estado
     */
    default String mapEstado(Boolean eliminado) {
        return eliminado != null && eliminado ? "ELIMINADA" : "ACTIVA";
    }
}
