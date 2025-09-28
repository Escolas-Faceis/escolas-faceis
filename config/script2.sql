CREATE DATABASE IF NOT EXISTS escolas_faceis;
USE escolas_faceis;

DROP TABLE IF EXISTS imagens;
CREATE TABLE imagens (
    id_imagem INT AUTO_INCREMENT PRIMARY KEY,
    nome_imagem VARCHAR(255),
    caminho_imagem VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome_usuario NVARCHAR(100) NOT NULL,
    email_usuario NVARCHAR(100) NOT NULL UNIQUE,
    telefone_usuario NVARCHAR(20) NULL,
    senha_usuario NVARCHAR(255) NOT NULL,
    biografia_usuario VARCHAR(255) NULL,
    tipo_usuario ENUM('Escola','Comum','ADM'),
    status_usuario INT DEFAULT 1 CHECK (status_usuario IN (0, 1)),
    img_perfil_id INT DEFAULT NULL,
    FOREIGN KEY (img_perfil_id) REFERENCES imagens(id_imagem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS escolas;
CREATE TABLE escolas (
    id_escola INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    nome_escola NVARCHAR(100) NOT NULL,
    email_escola NVARCHAR(100) NOT NULL UNIQUE,
    senha_escola NVARCHAR(255) NOT NULL,
    cep CHAR(9) NOT NULL,
    endereco NVARCHAR(255) NOT NULL,
    numero INT NOT NULL,
    cnpj CHAR(18) NOT NULL UNIQUE,
    tipo_ensino NVARCHAR(255),
    turnos NVARCHAR(255),
    rede NVARCHAR(50),
    img_perfil_id INT DEFAULT NULL,
    FOREIGN KEY (img_perfil_id) REFERENCES imagens(id_imagem),
    whatsapp VARCHAR(20) NULL,
    telefone VARCHAR(20) NULL,
    instagram VARCHAR(100) NULL,
    facebook VARCHAR(100) NULL,
    email VARCHAR(100) NULL,
    sobre_escola TEXT NULL,
    sobre_ensino TEXT NULL,
    sobre_estrutura TEXT NULL,
    ingresso VARCHAR(255) NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS avaliacoes;
CREATE TABLE avaliacoes (
    id_avaliacao INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_escola INT NOT NULL,
    comentario NVARCHAR(500),
    data_avaliacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nota INT CHECK (nota BETWEEN 1 AND 5),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_escola) REFERENCES escolas(id_escola)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS imagens_escola;
CREATE TABLE imagens_escola (
    id_imagem_escola INT PRIMARY KEY AUTO_INCREMENT,
    id_escola INT NOT NULL,
    id_imagem INT NOT NULL,
    FOREIGN KEY (id_escola) REFERENCES escolas(id_escola),
    FOREIGN KEY (id_imagem) REFERENCES imagens(id_imagem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS imagens_avaliacao;
CREATE TABLE imagens_avaliacao (
    id_img_avaliacao INT PRIMARY KEY AUTO_INCREMENT,
    id_avaliacao INT NOT NULL,
    id_imagem INT NOT NULL,
    FOREIGN KEY (id_avaliacao) REFERENCES avaliacoes(id_avaliacao) ON DELETE CASCADE,
    FOREIGN KEY (id_imagem) REFERENCES imagens(id_imagem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS tipos_ensino;
CREATE TABLE tipos_ensino (
    id_tipo_ensino INT PRIMARY KEY AUTO_INCREMENT,
    nome_tipo_ensino VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS turnos;
CREATE TABLE turnos (
    id_turno INT PRIMARY KEY AUTO_INCREMENT,
    nome_turno VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT IGNORE INTO tipos_ensino (nome_tipo_ensino) VALUES
('Educação Infantil'),
('Ensino Fundamental I'),
('Ensino Fundamental II'),
('Ensino Médio'),
('Educação Integrada'),
('Cursos Técnicos'),
('Cursos Extracurriculares'),
('Cursos de Idioma');

INSERT IGNORE INTO turnos (nome_turno) VALUES
('Manhã'),
('Tarde'),
('Integral'),
('Noite'),
('Sábado');
