package com.cqrs.patroncqrs.command.mapper;

import com.cqrs.patroncqrs.command.dto.CrearCategoriaCommand;
import com.cqrs.patroncqrs.domain.entity.Categoria;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.WARN
)
public interface CategoriaCommandMapper {

    /**
     * Convierte un Command a una entidad Categoria nueva
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "nombre", source = "nombre")
    @Mapping(target = "descripcion", source = "descripcion")
    @Mapping(target = "eliminado", constant = "false")
    Categoria toEntity(CrearCategoriaCommand command);

    /**
     * Actualiza una entidad Categoria existente
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "nombre", source = "nombre")
    @Mapping(target = "descripcion", source = "descripcion")
    @Mapping(target = "eliminado", ignore = true)
    void updateEntity(@MappingTarget Categoria categoria, CrearCategoriaCommand command);


}
