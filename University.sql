-- Tabla: Estudiantes
CREATE TABLE estudiantes (
    id_estudiante INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    fecha_nacimiento DATE
);

-- Tabla: Docentes
CREATE TABLE docentes (
    id_docente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    especialidad VARCHAR(100)
);

-- Tabla: Materias
CREATE TABLE materias (
    id_materia INT AUTO_INCREMENT PRIMARY KEY,
    nombre_materia VARCHAR(100) NOT NULL,
    id_docente INT,
    FOREIGN KEY (id_docente) REFERENCES docentes(id_docente)
);

-- Tabla: Aulas
CREATE TABLE aulas (
    id_aula INT AUTO_INCREMENT PRIMARY KEY,
    nombre_aula VARCHAR(50) NOT NULL,
    capacidad INT NOT NULL
);

-- Tabla: Calificaciones
CREATE TABLE calificaciones (
    id_calificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_estudiante INT,
    id_materia INT,
    nota DECIMAL(4,2) NOT NULL,
    fecha_registro DATE NOT NULL,
    FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id_estudiante),
    FOREIGN KEY (id_materia) REFERENCES materias(id_materia)
);

-- Insertar datos en estudiantes (15 registros)
INSERT INTO estudiantes (nombre, apellido, email, fecha_nacimiento) VALUES
('Juan', 'Pérez', 'juan.perez@university.com', '2000-03-15'),
('María', 'Gómez', 'maria.gomez@university.com', '1999-07-22'),
('Carlos', 'López', 'carlos.lopez@university.com', '2001-01-10'),
('Ana', 'Martínez', 'ana.martinez@university.com', '2000-11-30'),
('Luis', 'Rodríguez', 'luis.rodriguez@university.com', '2002-05-18'),
('Sofía', 'Hernández', 'sofia.hernandez@university.com', '1998-09-12'),
('Diego', 'García', 'diego.garcia@university.com', '2001-04-25'),
('Laura', 'Fernández', 'laura.fernandez@university.com', '1999-12-05'),
('Pedro', 'Ruiz', 'pedro.ruiz@university.com', '2000-06-20'),
('Valeria', 'Díaz', 'valeria.diaz@university.com', '2001-08-14'),
('Andrés', 'Sánchez', 'andres.sanchez@university.com', '2000-02-28'),
('Camila', 'Torres', 'camila.torres@university.com', '1999-10-10'),
('Felipe', 'Ramírez', 'felipe.ramirez@university.com', '2002-03-03'),
('Lucía', 'Vega', 'lucia.vega@university.com', '2001-07-07'),
('Mateo', 'Morales', 'mateo.morales@university.com', '2000-05-15');

-- Insertar datos en docentes (12 registros)
INSERT INTO docentes (nombre, apellido, email, especialidad) VALUES
('José', 'Moreno', 'jose.moreno@university.com', 'Matemáticas'),
('Carmen', 'Jiménez', 'carmen.jimenez@university.com', 'Física'),
('Ricardo', 'Vargas', 'ricardo.vargas@university.com', 'Informática'),
('Elena', 'Castro', 'elena.castro@university.com', 'Química'),
('Miguel', 'Ortega', 'miguel.ortega@university.com', 'Historia'),
('Patricia', 'Reyes', 'patricia.reyes@university.com', 'Literatura'),
('Javier', 'Molina', 'javier.molina@university.com', 'Biología'),
('Isabel', 'Silva', 'isabel.silva@university.com', 'Estadística'),
('Raúl', 'Campos', 'raul.campos@university.com', 'Ingeniería'),
('Mónica', 'Ríos', 'monica.rios@university.com', 'Economía'),
('Alberto', 'Guerrero', 'alberto.guerrero@university.com', 'Filosofía'),
('Verónica', 'Méndez', 'veronica.mendez@university.com', 'Psicología');

-- Insertar datos en materias (12 registros)
INSERT INTO materias (nombre_materia, id_docente) VALUES
('Cálculo I', 1),
('Física General', 2),
('Programación I', 3),
('Química Orgánica', 4),
('Historia Universal', 5),
('Literatura Clásica', 6),
('Biología Celular', 7),
('Estadística Básica', 8),
('Mecánica de Fluidos', 9),
('Microeconomía', 10),
('Filosofía Antigua', 11),
('Psicología General', 12);

-- Insertar datos en aulas (14 registros)
INSERT INTO aulas (nombre_aula, capacidad) VALUES
('Aula 101', 30),
('Aula 102', 25),
('Aula 103', 40),
('Aula 104', 35),
('Aula 201', 20),
('Aula 202', 30),
('Aula 203', 25),
('Aula 204', 40),
('Aula 301', 30),
('Aula 302', 35),
('Aula 303', 20),
('Aula 304', 25),
('Laboratorio 1', 15),
('Laboratorio 2', 15);

-- Insertar datos en calificaciones (15 registros)
INSERT INTO calificaciones (id_estudiante, id_materia, nota, fecha_registro) VALUES
(1, 1, 8.5, '2025-01-15'),
(2, 1, 7.0, '2025-01-15'),
(3, 2, 9.0, '2025-01-16'),
(4, 3, 6.5, '2025-01-16'),
(5, 4, 8.0, '2025-01-17'),
(6, 5, 7.5, '2025-01-17'),
(7, 6, 9.5, '2025-01-18'),
(8, 7, 6.0, '2025-01-18'),
(9, 8, 8.0, '2025-01-19'),
(10, 9, 7.8, '2025-01-19'),
(11, 10, 9.2, '2025-01-20'),
(12, 11, 6.8, '2025-01-20'),
(13, 12, 8.3, '2025-01-21'),
(14, 1, 7.2, '2025-01-21'),
(15, 2, 8.7, '2025-01-22');