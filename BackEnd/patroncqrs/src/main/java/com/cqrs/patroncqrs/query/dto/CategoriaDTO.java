package com.cqrs.patroncqrs.query.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private Boolean eliminado;
    private Integer cantidadProductos;

    private String estado;

}
