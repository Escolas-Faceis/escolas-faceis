-- Tabela para tipos de ensino disponíveis
CREATE TABLE IF NOT EXISTS tipos_ensino (
    id_tipo_ensino INT PRIMARY KEY AUTO_INCREMENT,
    nome_tipo_ensino VARCHAR(50) NOT NULL UNIQUE,
);

-- Tabela para turnos disponíveis
CREATE TABLE IF NOT EXISTS turnos (
    id_turno INT PRIMARY KEY AUTO_INCREMENT,
    nome_turno VARCHAR(50) NOT NULL UNIQUE,
);

-- Tabela para redes disponíveis
CREATE TABLE IF NOT EXISTS redes (
    id_rede INT PRIMARY KEY AUTO_INCREMENT,
    nome_rede VARCHAR(50) NOT NULL UNIQUE,
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
