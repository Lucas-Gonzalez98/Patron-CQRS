package com.cqrs.patroncqrs.command.service;

import com.cqrs.patroncqrs.command.dto.CrearCategoriaCommand;
import jakarta.validation.constraints.*;

public interface CategoriaCommandService {

    Long crearCategoria(CrearCategoriaCommand command);
    void actualizarCategoria(Long id, CrearCategoriaCommand command);
    void eliminarCategoria(Long id);
    void restaurarCategoria(Long id);
}
