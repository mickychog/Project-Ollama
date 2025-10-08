USE ECommerceDB;

-- Desactivar restricciones de claves foráneas para vaciar tablas
SET FOREIGN_KEY_CHECKS = 0;

-- Vaciar todas las tablas
TRUNCATE TABLE Carrito;
TRUNCATE TABLE Resenas;
TRUNCATE TABLE Envios;
TRUNCATE TABLE Pagos;
TRUNCATE TABLE DetallesPedidos;
TRUNCATE TABLE Pedidos;
TRUNCATE TABLE Inventario;
TRUNCATE TABLE Productos;
TRUNCATE TABLE Proveedores;
TRUNCATE TABLE Categorias;
TRUNCATE TABLE Direcciones;
TRUNCATE TABLE Usuarios;

-- Reactivar restricciones de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

-- Listas de nombres, apellidos, ciudades, etc. para datos realistas
CREATE TEMPORARY TABLE temp_names (name VARCHAR(50));
INSERT INTO temp_names (name) VALUES
('John'), ('Emma'), ('Michael'), ('Sophia'), ('James'), ('Olivia'), ('William'), ('Ava'),
('David'), ('Isabella'), ('Joseph'), ('Mia'), ('Thomas'), ('Charlotte'), ('Daniel'), ('Amelia');

CREATE TEMPORARY TABLE temp_lastnames (lastname VARCHAR(50));
INSERT INTO temp_lastnames (lastname) VALUES
('Smith'), ('Johnson'), ('Brown'), ('Taylor'), ('Wilson'), ('Davis'), ('Clark'), ('Harris'),
('Lewis'), ('Walker'), ('Hall'), ('Allen'), ('Young'), ('King'), ('Wright'), ('Scott');

CREATE TEMPORARY TABLE temp_cities (city VARCHAR(50));
INSERT INTO temp_cities (city) VALUES
('Madrid'), ('Barcelona'), ('Valencia'), ('Seville'), ('Bilbao'), ('Malaga'), ('Zaragoza'), ('Murcia');

CREATE TEMPORARY TABLE temp_categories (category VARCHAR(100));
INSERT INTO temp_categories (category) VALUES
('Electronics'), ('Clothing'), ('Books'), ('Home Appliances'), ('Toys'), ('Sports'), ('Furniture'), ('Jewelry'),
('Beauty'), ('Automotive'), ('Groceries'), ('Health');

CREATE TEMPORARY TABLE temp_suppliers (supplier VARCHAR(100));
INSERT INTO temp_suppliers (supplier) VALUES
('TechSupply Co'), ('FashionHub'), ('BookWorld'), ('HomeTech'), ('ToyLand'), ('SportZone'), ('FurnitureMart'), ('JewelCraft');

-- Agregar 400 usuarios
INSERT INTO Usuarios (nombre, apellido, email, fecha_registro)
SELECT 
    n.name,
    l.lastname,
    CONCAT(LOWER(n.name), '.', LOWER(l.lastname), '@email.com') AS email,
    DATE_SUB('2025-10-06', INTERVAL (n_idx * 16 + l_idx) DAY) AS fecha_registro
FROM (
    SELECT name, ROW_NUMBER() OVER () - 1 AS n_idx
    FROM temp_names
) n
CROSS JOIN (
    SELECT lastname, ROW_NUMBER() OVER () - 1 AS l_idx
    FROM temp_lastnames
) l
LIMIT 400;

-- Agregar 400 direcciones
INSERT INTO Direcciones (id_usuario, calle, ciudad, pais, codigo_postal)
SELECT 
    id_usuario,
    CONCAT(FLOOR(RAND() * 1000) + 1, ' Street ', n_idx % 10) AS calle,
    c.city,
    'Spain' AS pais,
    CONCAT('28', LPAD(n_idx, 3, '0')) AS codigo_postal
FROM Usuarios u
JOIN (
    SELECT name, ROW_NUMBER() OVER () - 1 AS n_idx
    FROM temp_names
) n
JOIN temp_cities c
WHERE u.id_usuario <= 400
LIMIT 400;

-- Agregar 100 categorías
INSERT INTO Categorias (nombre_categoria, descripcion)
SELECT 
    CONCAT(t.category, ' ', n) AS nombre_categoria,
    CONCAT('Description for ', t.category, ' ', n) AS descripcion
FROM (
    SELECT a.N + b.N * 10 + 1 AS n
    FROM 
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
         UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
         UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b
    WHERE a.N + b.N * 10 + 1 <= 100
) numbers
CROSS JOIN temp_categories t
LIMIT 100;

-- Agregar 100 proveedores
INSERT INTO Proveedores (nombre_proveedor, contacto)
SELECT 
    CONCAT(t.supplier, ' ', n) AS nombre_proveedor,
    CONCAT('contact', n, '@', LOWER(REPLACE(t.supplier, ' ', '')), '.com') AS contacto
FROM (
    SELECT a.N + b.N * 10 + 1 AS n
    FROM 
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
         UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
         UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b
    WHERE a.N + b.N * 10 + 1 <= 100
) numbers
CROSS JOIN temp_suppliers t
LIMIT 100;

-- Agregar 400 productos
INSERT INTO Productos (nombre_producto, id_categoria, id_proveedor, precio, descripcion)
SELECT 
    CONCAT('Product ', n, ' - ', t.category) AS nombre_producto,
    (n % 100) + 1 AS id_categoria,
    (n % 100) + 1 AS id_proveedor,
    ROUND(RAND() * 1000 + 10, 2) AS precio,
    CONCAT('Description for product ', n) AS descripcion
FROM (
    SELECT a.N + b.N * 10 + c.N * 100 + 1 AS n
    FROM 
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
         UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
         UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b,
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3) c
    WHERE a.N + b.N * 10 + c.N * 100 + 1 <= 400
) numbers
CROSS JOIN temp_categories t
LIMIT 400;

-- Agregar 400 registros de inventario
INSERT INTO Inventario (id_producto, cantidad_disponible, ubicacion)
SELECT 
    id_producto,
    FLOOR(RAND() * 100) + 10 AS cantidad_disponible,
    CONCAT('Warehouse ', id_producto % 10) AS ubicacion
FROM Productos
WHERE id_producto <= 400;

-- Agregar 200 pedidos
INSERT INTO Pedidos (id_usuario, fecha_pedido, total)
SELECT 
    (n % 400) + 1 AS id_usuario,
    DATE_SUB('2025-10-06', INTERVAL n DAY) AS fecha_pedido,
    ROUND(RAND() * 500 + 50, 2) AS total
FROM (
    SELECT a.N + b.N * 10 + 1 AS n
    FROM 
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
         UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
         UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 
         UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 
         UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19) b
    WHERE a.N + b.N * 10 + 1 <= 200
) numbers;

-- Agregar 200 detalles de pedidos
INSERT INTO DetallesPedidos (id_pedido, id_producto, cantidad, precio_unitario)
SELECT 
    id_pedido,
    (id_pedido % 400) + 1 AS id_producto,
    FLOOR(RAND() * 5) + 1 AS cantidad,
    ROUND(RAND() * 100 + 10, 2) AS precio_unitario
FROM Pedidos
WHERE id_pedido <= 200;

-- Agregar 200 pagos
INSERT INTO Pagos (id_pedido, monto, metodo_pago, fecha_pago)
SELECT 
    id_pedido,
    total AS monto,
    CASE 
        WHEN id_pedido % 3 = 0 THEN 'CreditCard'
        WHEN id_pedido % 3 = 1 THEN 'PayPal'
        ELSE 'BankTransfer'
    END AS metodo_pago,
    fecha_pedido AS fecha_pago
FROM Pedidos
WHERE id_pedido <= 200;

-- Agregar 200 envíos
INSERT INTO Envios (id_pedido, fecha_envio, estado)
SELECT 
    id_pedido,
    DATE_ADD(fecha_pedido, INTERVAL 2 DAY) AS fecha_envio,
    CASE 
        WHEN id_pedido % 3 = 0 THEN 'InTransit'
        WHEN id_pedido % 3 = 1 THEN 'Delivered'
        ELSE 'Preparing'
    END AS estado
FROM Pedidos
WHERE id_pedido <= 200;

-- Agregar 100 reseñas
INSERT INTO Resenas (id_producto, id_usuario, calificacion, comentario, fecha_resena)
SELECT 
    (n % 400) + 1 AS id_producto,
    (n % 400) + 1 AS id_usuario,
    FLOOR(RAND() * 5) + 1 AS calificacion,
    CONCAT('Review for product ', n) AS comentario,
    DATE_SUB('2025-10-06', INTERVAL n DAY) AS fecha_resena
FROM (
    SELECT a.N + b.N * 10 + 1 AS n
    FROM 
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
         UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
         UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b
    WHERE a.N + b.N * 10 + 1 <= 100
) numbers;

-- Agregar 100 ítems al carrito
INSERT INTO Carrito (id_usuario, id_producto, cantidad)
SELECT 
    (n % 400) + 1 AS id_usuario,
    (n % 400) + 1 AS id_producto,
    FLOOR(RAND() * 5) + 1 AS cantidad
FROM (
    SELECT a.N + b.N * 10 + 1 AS n
    FROM 
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
         UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
         UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b
    WHERE a.N + b.N * 10 + 1 <= 100
) numbers;

-- Eliminar tablas temporales
DROP TEMPORARY TABLE temp_names;
DROP TEMPORARY TABLE temp_lastnames;
DROP TEMPORARY TABLE temp_cities;
DROP TEMPORARY TABLE temp_categories;
DROP TEMPORARY TABLE temp_suppliers;

-- Verificar el total de registros
SELECT 'Usuarios' AS tabla, COUNT(*) AS total FROM Usuarios
UNION SELECT 'Direcciones', COUNT(*) FROM Direcciones
UNION SELECT 'Categorias', COUNT(*) FROM Categorias
UNION SELECT 'Proveedores', COUNT(*) FROM Proveedores
UNION SELECT 'Productos', COUNT(*) FROM Productos
UNION SELECT 'Inventario', COUNT(*) FROM Inventario
UNION SELECT 'Pedidos', COUNT(*) FROM Pedidos
UNION SELECT 'DetallesPedidos', COUNT(*) FROM DetallesPedidos
UNION SELECT 'Pagos', COUNT(*) FROM Pagos
UNION SELECT 'Envios', COUNT(*) FROM Envios
UNION SELECT 'Resenas', COUNT(*) FROM Resenas
UNION SELECT 'Carrito', COUNT(*) FROM Carrito;