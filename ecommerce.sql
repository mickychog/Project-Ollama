-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS ECommerceDB;
USE ECommerceDB;

-- Tabla 1: Usuarios (200 registros)
CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    fecha_registro DATE NOT NULL
) ENGINE=InnoDB;

-- Tabla 2: Direcciones (200 registros)
CREATE TABLE Direcciones (
    id_direccion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    calle VARCHAR(100) NOT NULL,
    ciudad VARCHAR(50) NOT NULL,
    pais VARCHAR(50) NOT NULL,
    codigo_postal VARCHAR(10),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
) ENGINE=InnoDB;

-- Tabla 3: Categorías (50 registros)
CREATE TABLE Categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL,
    descripcion TEXT
) ENGINE=InnoDB;

-- Tabla 4: Proveedores (50 registros)
CREATE TABLE Proveedores (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre_proveedor VARCHAR(100) NOT NULL,
    contacto VARCHAR(100)
) ENGINE=InnoDB;

-- Tabla 5: Productos (200 registros)
CREATE TABLE Productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL,
    id_categoria INT,
    id_proveedor INT,
    precio DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria),
    FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id_proveedor)
) ENGINE=InnoDB;

-- Tabla 6: Inventario (200 registros)
CREATE TABLE Inventario (
    id_inventario INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT,
    cantidad_disponible INT NOT NULL,
    ubicacion VARCHAR(100),
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
) ENGINE=InnoDB;

-- Tabla 7: Pedidos (100 registros)
CREATE TABLE Pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    fecha_pedido DATE NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
) ENGINE=InnoDB;

-- Tabla 8: DetallesPedidos (100 registros)
CREATE TABLE DetallesPedidos (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT,
    id_producto INT,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
) ENGINE=InnoDB;

-- Tabla 9: Pagos (100 registros)
CREATE TABLE Pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    fecha_pago DATE NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido)
) ENGINE=InnoDB;

-- Tabla 10: Envíos (100 registros)
CREATE TABLE Envios (
    id_envio INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT,
    fecha_envio DATE,
    estado VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido)
) ENGINE=InnoDB;

-- Tabla 11: Reseñas (50 registros)
CREATE TABLE Resenas (
    id_resena INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT,
    id_usuario INT,
    calificacion INT NOT NULL,
    comentario TEXT,
    fecha_resena DATE NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
) ENGINE=InnoDB;

-- Tabla 12: Carrito (50 registros)
CREATE TABLE Carrito (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_producto INT,
    cantidad INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
) ENGINE=InnoDB;

-- Insertar datos (1100 registros en total)

-- Usuarios (200 registros)
INSERT INTO Usuarios (nombre, apellido, email, fecha_registro)
SELECT 
    CONCAT('Usuario', n) AS nombre,
    CONCAT('Apellido', n) AS apellido,
    CONCAT('usuario', n, '@email.com') AS email,
    DATE_SUB('2025-10-01', INTERVAL n DAY) AS fecha_registro
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

-- Direcciones (200 registros)
INSERT INTO Direcciones (id_usuario, calle, ciudad, pais, codigo_postal)
SELECT 
    id_usuario,
    CONCAT('Calle ', id_usuario) AS calle,
    'Madrid' AS ciudad,
    'España' AS pais,
    CONCAT('280', LPAD(id_usuario, 2, '0')) AS codigo_postal
FROM Usuarios;

-- Categorías (50 registros)
INSERT INTO Categorias (nombre_categoria, descripcion)
SELECT 
    CONCAT('Categoría ', n) AS nombre_categoria,
    CONCAT('Descripción de la categoría ', n) AS descripcion
FROM (
    SELECT a.N + b.N * 10 + 1 AS n
    FROM 
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
         UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) b
    WHERE a.N + b.N * 10 + 1 <= 50
) numbers;

-- Proveedores (50 registros)
INSERT INTO Proveedores (nombre_proveedor, contacto)
SELECT 
    CONCAT('Proveedor ', n) AS nombre_proveedor,
    CONCAT('contacto', n, '@proveedor.com') AS contacto
FROM (
    SELECT a.N + b.N * 10 + 1 AS n
    FROM 
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
         UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) b
    WHERE a.N + b.N * 10 + 1 <= 50
) numbers;

-- Productos (200 registros)
INSERT INTO Productos (nombre_producto, id_categoria, id_proveedor, precio, descripcion)
SELECT 
    CONCAT('Producto ', n) AS nombre_producto,
    (n % 50) + 1 AS id_categoria,
    (n % 50) + 1 AS id_proveedor,
    ROUND(RAND() * 1000 + 10, 2) AS precio,
    CONCAT('Descripción del producto ', n) AS descripcion
FROM (
    SELECT a.N + b.N * 10 + c.N * 100 + 1 AS n
    FROM 
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
         UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
         UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b,
        (SELECT 0 AS N UNION SELECT 1) c
    WHERE a.N + b.N * 10 + c.N * 100 + 1 <= 200
) numbers;

-- Inventario (200 registros)
INSERT INTO Inventario (id_producto, cantidad_disponible, ubicacion)
SELECT 
    id_producto,
    FLOOR(RAND() * 100) + 10 AS cantidad_disponible,
    CONCAT('Almacén ', id_producto % 10) AS ubicacion
FROM Productos;

-- Pedidos (100 registros)
INSERT INTO Pedidos (id_usuario, fecha_pedido, total)
SELECT 
    (n % 200) + 1 AS id_usuario,
    DATE_SUB('2025-10-01', INTERVAL n DAY) AS fecha_pedido,
    ROUND(RAND() * 500 + 50, 2) AS total
FROM (
    SELECT a.N + b.N * 10 + 1 AS n
    FROM 
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
         UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
         UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b
    WHERE a.N + b.N * 10 + 1 <= 100
) numbers;

-- DetallesPedidos (100 registros)
INSERT INTO DetallesPedidos (id_pedido, id_producto, cantidad, precio_unitario)
SELECT 
    id_pedido,
    (id_pedido % 200) + 1 AS id_producto,
    FLOOR(RAND() * 5) + 1 AS cantidad,
    ROUND(RAND() * 100 + 10, 2) AS precio_unitario
FROM Pedidos;

-- Pagos (100 registros)
INSERT INTO Pagos (id_pedido, monto, metodo_pago, fecha_pago)
SELECT 
    id_pedido,
    total AS monto,
    CASE 
        WHEN id_pedido % 3 = 0 THEN 'Tarjeta'
        WHEN id_pedido % 3 = 1 THEN 'PayPal'
        ELSE 'Transferencia'
    END AS metodo_pago,
    fecha_pedido AS fecha_pago
FROM Pedidos;

-- Envíos (100 registros)
INSERT INTO Envios (id_pedido, fecha_envio, estado)
SELECT 
    id_pedido,
    DATE_ADD(fecha_pedido, INTERVAL 2 DAY) AS fecha_envio,
    CASE 
        WHEN id_pedido % 3 = 0 THEN 'En tránsito'
        WHEN id_pedido % 3 = 1 THEN 'Entregado'
        ELSE 'En preparación'
    END AS estado
FROM Pedidos;

-- Reseñas (50 registros)
INSERT INTO Resenas (id_producto, id_usuario, calificacion, comentario, fecha_resena)
SELECT 
    (n % 200) + 1 AS id_producto,
    (n % 200) + 1 AS id_usuario,
    FLOOR(RAND() * 5) + 1 AS calificacion,
    CONCAT('Comentario sobre producto ', n) AS comentario,
    DATE_SUB('2025-10-01', INTERVAL n DAY) AS fecha_resena
FROM (
    SELECT a.N + b.N * 10 + 1 AS n
    FROM 
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
         UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) b
    WHERE a.N + b.N * 10 + 1 <= 50
) numbers;

-- Carrito (50 registros)
INSERT INTO Carrito (id_usuario, id_producto, cantidad)
SELECT 
    (n % 200) + 1 AS id_usuario,
    (n % 200) + 1 AS id_producto,
    FLOOR(RAND() * 5) + 1 AS cantidad
FROM (
    SELECT a.N + b.N * 10 + 1 AS n
    FROM 
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
         UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
        (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) b
    WHERE a.N + b.N * 10 + 1 <= 50
) numbers;

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