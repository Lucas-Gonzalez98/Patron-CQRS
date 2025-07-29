package com.cqrs.patroncqrs.command.service;

import com.cqrs.patroncqrs.command.dto.CrearProductoCommand;

public interface ProductoCommandService {
    Long crearProducto(CrearProductoCommand command);
    void actualizarProducto(Long id, CrearProductoCommand command);
    void eliminarProducto(Long id);
    void restaurarProducto(Long id);
}
