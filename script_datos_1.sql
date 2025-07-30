use patroncqrs;

INSERT INTO categorias (id, nombre, descripcion, eliminado) VALUES
                                                                (1, 'Lácteos', 'Productos derivados de la leche', false),
                                                                (2, 'Carnes', 'Carnes rojas, blancas y embutidos', false),
                                                                (3, 'Panadería', 'Pan, facturas y productos horneados', false),
                                                                (4, 'Bebidas', 'Gaseosas, jugos, aguas y energizantes', false),
                                                                (5, 'Verduras', 'Vegetales frescos', false),
                                                                (6, 'Frutas', 'Frutas frescas y secas', false),
                                                                (7, 'Limpieza', 'Productos de limpieza y desinfección', false),
                                                                (8, 'Higiene Personal', 'Shampoo, jabón, pasta dental, etc.', false),
                                                                (9, 'Almacén', 'Aceite, arroz, fideos, conservas', false),
                                                                (10, 'Snacks', 'Galletitas, papas fritas, chocolates', false),
                                                                (11, 'Congelados', 'Comidas congeladas, helados, etc.', false),
                                                                (12, 'Mascotas', 'Alimentos y artículos para mascotas', false),
                                                                (13, 'Bebidas Alcohólicas', 'Cervezas, vinos y licores', false),
                                                                (14, 'Cereales', 'Desayunos, avenas y granolas', false),
                                                                (15, 'Bebés', 'Pañales, alimentos y cuidado del bebé', false);


INSERT INTO productos (nombre, descripcion, precio, stock, eliminado, categoria_id) VALUES
-- Lácteos
('Leche entera La Serenísima', 'Leche entera 1L', 1320, 100, false, 1),
('Queso Cremoso', 'Queso fresco tipo cremoso', 6050, 30, false, 1),
('Yogur bebible frutilla', 'Yogur líquido sabor frutilla 900ml', 2200, 50, false, 1),

-- Carnes
('Carne picada común', 'Carne vacuna molida', 7480, 40, false, 2),
('Pechuga de pollo', 'Pechuga deshuesada', 8250, 35, false, 2),
('Chorizo parrillero', 'Chorizo criollo para asado', 4620, 20, false, 2),

-- Panadería
('Pan francés', 'Pan fresco del día', 1100, 60, false, 3),
('Medialunas dulces', 'Medialunas de manteca x6', 3520, 25, false, 3),
('Pan de molde', 'Pan lactal blanco', 2750, 40, false, 3),

-- Bebidas
('Coca Cola 2.25L', 'Gaseosa clásica', 3300, 80, false, 4),
('Agua sin gas 1.5L', 'Agua mineral natural', 1210, 100, false, 4),
('Jugo Baggio Multifruta', 'Jugo en cartón 1L', 2090, 70, false, 4),

-- Verduras
('Lechuga criolla', 'Fresca y lavada', 880, 50, false, 5),
('Tomate redondo', 'Tomate fresco por kilo', 1760, 60, false, 5),
('Papa blanca', 'Papa común por kilo', 1100, 80, false, 5),

-- Frutas
('Banana ecuatoriana', 'Banana por kilo', 2090, 70, false, 6),
('Manzana roja', 'Manzana por unidad', 770, 100, false, 6),
('Naranja para jugo', 'Naranja fresca por kilo', 1320, 90, false, 6),

-- Limpieza
('Lavandina Ayudín', 'Botella 1L', 1650, 40, false, 7),
('Detergente Magistral', 'Detergente limón 750ml', 2530, 60, false, 7),
('Limpiador multiuso', 'Botella 1L aroma lavanda', 1980, 30, false, 7),

-- Higiene Personal
('Shampoo Sedal', 'Shampoo para cabello normal', 3740, 45, false, 8),
('Jabón Dove', 'Jabón de tocador 90g', 1320, 80, false, 8),
('Pasta dental Colgate', 'Crema dental 90g', 1650, 60, false, 8),

-- Almacén
('Aceite Natura', 'Aceite de girasol 1.5L', 4620, 50, false, 9),
('Arroz largo fino', 'Paquete 1kg', 2200, 70, false, 9),
('Fideos tirabuzón', 'Fideos secos 500g', 1650, 80, false, 9),

-- Snacks
('Galletitas Chocolinas', 'Paquete 200g', 1870, 90, false, 10),
('Papas Lays Clásicas', 'Bolsa 120g', 2530, 50, false, 10),
('Chocolate Milka', 'Chocolate con leche 100g', 2200, 60, false, 10),

-- Congelados
('Pizza congelada', 'Muzzarella lista para horno', 4950, 30, false, 11),
('Helado Grido 1L', 'Helado sabor vainilla', 3520, 25, false, 11),
('Vegetales congelados', 'Mix de verduras 1kg', 4180, 35, false, 11),

-- Mascotas
('Alimento Dog Chow', 'Bolsa 3kg para perros adultos', 11000, 20, false, 12),
('Comedero plástico', 'Comedero chico para perros/gatos', 2200, 40, false, 12),
('Arena para gatos', 'Bolsa 5kg', 6050, 15, false, 12),

-- Bebidas Alcohólicas
('Cerveza Quilmes 1L', 'Botella retornable', 2200, 60, false, 13),
('Vino Malbec', 'Botella 750ml', 5280, 35, false, 13),
('Fernet Branca 750ml', 'Aperitivo italiano', 8800, 25, false, 13),

-- Cereales
('Avena instantánea', 'Paquete 500g', 2420, 45, false, 14),
('Cereal Nesquik', 'Cereal chocolateado 200g', 3190, 30, false, 14),
('Granola con frutos secos', 'Paquete 400g', 3850, 20, false, 14),

-- Bebés
('Pañales Pampers M x30', 'Pack tamaño M', 11550, 15, false, 15),
('Toallitas húmedas', 'Paquete x70 unidades', 3080, 30, false, 15),
('Leche infantil Nutrilon', 'Lata 800g', 16500, 10, false, 15);

