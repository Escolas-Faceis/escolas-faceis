DROP DATABASE IF EXISTS escolas_faceis;
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
    nome_usuario VARCHAR(100) NOT NULL,
    email_usuario VARCHAR(100) NOT NULL UNIQUE,
    telefone_usuario VARCHAR(20) NULL,
    senha_usuario VARCHAR(255) NOT NULL,
    biografia_usuario VARCHAR(255) NULL,
    cor_banner VARCHAR(7) DEFAULT '#C7D3DD',
    tipo_usuario ENUM('E','C','A'),
    status_usuario INT DEFAULT 0 CHECK (status_usuario IN (0, 1)),
    img_perfil_id INT DEFAULT NULL,
    FOREIGN KEY (img_perfil_id) REFERENCES imagens(id_imagem),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
update usuarios set tipo_usuario = "A" where id_usuario = 1;

DROP TABLE IF EXISTS escolas;
CREATE TABLE escolas (
    id_escola INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    nome_escola VARCHAR(100) NOT NULL,
    email_escola VARCHAR(100) NOT NULL UNIQUE,
    senha_escola VARCHAR(255) NOT NULL,
    cep CHAR(9) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    numero INT NOT NULL,
    cnpj CHAR(18) NOT NULL UNIQUE,
    tipo_ensino VARCHAR(255),
    turnos VARCHAR(255),
    rede VARCHAR(50),
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
	
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS avaliacoes;
CREATE TABLE avaliacoes (
    id_avaliacao INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_escola INT NOT NULL,
    comentario VARCHAR(500),
    data_avaliacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nota INT CHECK (nota BETWEEN 1 AND 5),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_escola) REFERENCES escolas(id_escola),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

CREATE TABLE escola_tipos_ensino (
    id_escola INT NOT NULL,
    id_tipo_ensino INT NOT NULL,
    PRIMARY KEY (id_escola, id_tipo_ensino),
    FOREIGN KEY (id_escola) REFERENCES escolas(id_escola) ON DELETE CASCADE,
    FOREIGN KEY (id_tipo_ensino) REFERENCES tipos_ensino(id_tipo_ensino)
);

CREATE TABLE escola_turnos (
    id_escola INT NOT NULL,
    id_turno INT NOT NULL,
    PRIMARY KEY (id_escola, id_turno),
    FOREIGN KEY (id_escola) REFERENCES escolas(id_escola) ON DELETE CASCADE,
    FOREIGN KEY (id_turno) REFERENCES turnos(id_turno)
);

DROP TABLE IF EXISTS plano;
CREATE TABLE plano (
    id_plano int unsigned primary key auto_increment,
    nome_plano varchar(15) not null,
    preco_plano decimal(5,2) not null,
    duracao_plano char(1) not null
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE assinatura (
    id_assinatura INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_escola INT NOT NULL,
    id_plano INT UNSIGNED NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NULL,
    ativo BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (id_escola) REFERENCES escolas(id_escola),
    FOREIGN KEY (id_plano) REFERENCES plano(id_plano)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS denuncias;
CREATE TABLE denuncias (
    id_denuncia INT PRIMARY KEY AUTO_INCREMENT,

    -- QUEM DENUNCIA
    id_usuario_denunciante INT NULL,
    id_escola_denunciante INT NULL,

    -- QUEM É DENUNCIADO
    id_usuario_denunciado INT NULL,
    id_escola_denunciado INT NULL,

    motivo VARCHAR(255) NOT NULL,
    descricao TEXT NULL,
    data_denuncia DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('P', 'A', 'R') DEFAULT 'P', -- P: pendente; A: Em analise; R: resolvida

    FOREIGN KEY (id_usuario_denunciante) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_escola_denunciante) REFERENCES escolas(id_escola),
    FOREIGN KEY (id_usuario_denunciado) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_escola_denunciado) REFERENCES escolas(id_escola),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS notificacoes;
CREATE TABLE notificacoes (
    id_notificacao INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario_destinatario INT NOT NULL,
    tipo_notificacao VARCHAR(50) NOT NULL,
    mensagem TEXT NOT NULL,
    data_notificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lida BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_usuario_destinatario) REFERENCES usuarios(id_usuario)
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

CREATE INDEX idx_turno_nome ON turnos(nome_turno);
CREATE INDEX idx_tipo_ensino_nome ON tipos_ensino(nome_tipo_ensino);
CREATE INDEX idx_denuncias_status ON denuncias(status);
CREATE INDEX idx_escolas_nome ON escolas(nome_escola);
CREATE INDEX idx_escolas_rede ON escolas(rede);
CREATE INDEX idx_escolas_cep ON escolas(cep);
