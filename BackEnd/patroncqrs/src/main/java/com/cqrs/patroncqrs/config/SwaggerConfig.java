package com.cqrs.patroncqrs.config;

import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.*;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Patrón CQRS - API")
                        .description("Esta es la API de Patrón CQRS")
                        .version("v1")
                        .contact(new Contact()
                                .name("Lucas Gonzalez")
                                .url("https://github.com/Lucas-Gonzalez98/Patron-CQRS")
                                .email("lucasnicolasgonzalez07@gmail.com")
                        )
                        .termsOfService("https://example.com/terms")
                        .license(new License().name("API License").url("https://example.com/license"))
                );
    }
}
