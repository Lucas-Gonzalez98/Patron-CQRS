package com.cqrs.patroncqrs.query.dto;

import lombok.*;

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
