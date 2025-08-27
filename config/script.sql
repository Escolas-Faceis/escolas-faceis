CREATE DATABASE IF NOT EXISTS escolas_faceis;
USE escolas_faceis;

DROP TABLE  if exists usuarios;
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY not null auto_increment,
    nome_usuario NVARCHAR(100) NOT NULL,
    email_usuario NVARCHAR(100) NOT NULL UNIQUE,
    telefone_usuario NVARCHAR(20) NULL,
    senha_usuario NVARCHAR(255) NOT NULL,
    tipo_usuario ENUM('Escola','Comum', 'ADM'),
	img_perfil_pasta varchar(80) DEFAULT NULL,
    img_perfil_banco longblob,
    biografia_usuario varchar (255) NULL,
    status_usuario INT DEFAULT 1 check (status_usuario IN (0, 1)) -- 0: Inativo, 1: Ativo
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO usuarios (id_usuario, nome_usuario, email_usuario, telefone_usuario, senha_usuario, tipo_usuario, img_perfil_pasta, img_perfil_banco, biografia_usuario, status_usuario) VALUES (1, 'Ana Carolina', 'anaca.landim@gmail.com', '11960699510', 'maria555', 'ADM', '', '', 'biografia', 1);


DROP TABLE  if exists escolas;
CREATE TABLE escolas (
    id_escola INT PRIMARY KEY not null auto_increment,
    id_usuario INT NOT NULL,
    nome_escola NVARCHAR(100) NOT NULL,
    endereco NVARCHAR(150) NOT NULL,
    numero INT NOT NULL,
    cidade NVARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,  -- SELECT
    cnpj CHAR(18) NOT NULL UNIQUE,
    tipo_ensino NVARCHAR(100),  -- Checkbox: 
    turnos NVARCHAR(100),       -- Checkbox:
    rede NVARCHAR(50),          -- Checkbox: 
    email_escola NVARCHAR(100) NOT NULL UNIQUE,
    senha_escola NVARCHAR(255) NOT NULL,
	img_perfil_pasta varchar(80) DEFAULT NULL,
    img_perfil_banco longblob,
    
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE  if exists avaliacoes;
CREATE TABLE avaliacoes (
    id_avaliacao INT PRIMARY KEY not null auto_increment,
    id_usuario INT NOT NULL, 
    comentario NVARCHAR(500),
    data_avaliacao timestamp NOT NULL,
    nota INT CHECK (nota BETWEEN 1 AND 5),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);
DROP TABLE  if exists perfil_escola;
CREATE TABLE perfil_escola (
	sobre_escola varchar(300) null,
    sobre_ensino varchar(300) null,
    sobre_estrutura varchar(300) null,
    ingresso varchar(255) null
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE  if exists imagens_escola;
CREATE TABLE imagens_escola(
	id_img int PRIMARY KEY not null auto_increment,
    img_pasta varchar(80) default null,
    img_bd longblob,
    dono_img int,
    foreign key(dono_img) references escolas(id_escola)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabela para tipos de ensino disponíveis
CREATE TABLE IF NOT EXISTS tipos_ensino (
    id_tipo_ensino INT PRIMARY KEY AUTO_INCREMENT,
    nome_tipo_ensino VARCHAR(50) NOT NULL UNIQUE
);

-- Tabela para turnos disponíveis
CREATE TABLE IF NOT EXISTS turnos (
    id_turno INT PRIMARY KEY AUTO_INCREMENT,
    nome_turno VARCHAR(50) NOT NULL UNIQUE
);

-- Tabela para redes disponíveis
CREATE TABLE IF NOT EXISTS redes (
    id_rede INT PRIMARY KEY AUTO_INCREMENT,
    nome_rede VARCHAR(50) NOT NULL UNIQUE
);

-- Inserir dados padrão para tipos de ensino
INSERT IGNORE INTO tipos_ensino (nome_tipo_ensino) VALUES
('Educação Infantil'),
('Ensino Fundamental'),
('Ensino Médio'),
('Educação Integrada'),
('Cursos Técnicos'),
('Cursos Extracurriculares'),
('Cursos de Idioma');

-- Inserir dados padrão para turnos
INSERT IGNORE INTO turnos (nome_turno) VALUES
('Manhã'),
('Tarde'),
('Integral'),
('Noite'),
('Sábado');

-- Inserir dados padrão para redes
INSERT IGNORE INTO redes (nome_rede) VALUES
('Municipal'),
('Estadual'),
('Fundação'),
('Particular');

