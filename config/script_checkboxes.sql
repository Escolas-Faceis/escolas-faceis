-- Tabela para tipos de ensino disponíveis
CREATE TABLE IF NOT EXISTS tipos_ensino (
    id_tipo_ensino INT PRIMARY KEY AUTO_INCREMENT,
    nome_tipo_ensino VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(255)
);

-- Tabela para turnos disponíveis
CREATE TABLE IF NOT EXISTS turnos (
    id_turno INT PRIMARY KEY AUTO_INCREMENT,
    nome_turno VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(255)
);

-- Tabela para redes disponíveis
CREATE TABLE IF NOT EXISTS redes (
    id_rede INT PRIMARY KEY AUTO_INCREMENT,
    nome_rede VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(255)
);

-- Tabela de relacionamento escola -> tipos de ensino
CREATE TABLE IF NOT EXISTS escola_tipos_ensino (
    id_relacao INT PRIMARY KEY AUTO_INCREMENT,
    id_escola INT NOT NULL,
    id_tipo_ensino INT NOT NULL,
    FOREIGN KEY (id_escola) REFERENCES escolas(id_escola) ON DELETE CASCADE,
    FOREIGN KEY (id_tipo_ensino) REFERENCES tipos_ensino(id_tipo_ensino) ON DELETE CASCADE,
    UNIQUE KEY unique_escola_tipo (id_escola, id_tipo_ensino)
);

-- Tabela de relacionamento escola -> turnos
CREATE TABLE IF NOT EXISTS escola_turnos (
    id_relacao INT PRIMARY KEY AUTO_INCREMENT,
    id_escola INT NOT NULL,
    id_turno INT NOT NULL,
    FOREIGN KEY (id_escola) REFERENCES escolas(id_escola) ON DELETE CASCADE,
    FOREIGN KEY (id_turno) REFERENCES turnos(id_turno) ON DELETE CASCADE,
    UNIQUE KEY unique_escola_turno (id_escola, id_turno)
);

-- Tabela de relacionamento escola -> redes
CREATE TABLE IF NOT EXISTS escola_redes (
    id_relacao INT PRIMARY KEY AUTO_INCREMENT,
    id_escola INT NOT NULL,
    id_rede INT NOT NULL,
    FOREIGN KEY (id_escola) REFERENCES escolas(id_escola) ON DELETE CASCADE,
    FOREIGN KEY (id_rede) REFERENCES redes(id_rede) ON DELETE CASCADE,
    UNIQUE KEY unique_escola_rede (id_escola, id_rede)
);

-- Inserir dados padrão para tipos de ensino
INSERT IGNORE INTO tipos_ensino (nome_tipo_ensino, descricao) VALUES
('Educação Infantil', 'Educação para crianças de 0 a 5 anos'),
('Ensino Fundamental', 'Ensino Fundamental do 1º ao 9º ano'),
('Ensino Médio', 'Ensino Médio regular'),
('Educação Integrada', 'Educação que integra diferentes níveis'),
('Cursos Técnicos', 'Cursos técnicos profissionalizantes'),
('Cursos Extracurriculares', 'Cursos extracurriculares diversos'),
('Cursos de Idioma', 'Cursos de idiomas');

-- Inserir dados padrão para turnos
INSERT IGNORE INTO turnos (nome_turno, descricao) VALUES
('Manhã', 'Turno da manhã'),
('Tarde', 'Turno da tarde'),
('Integral', 'Período integral'),
('Noite', 'Turno da noite'),
('Sábado', 'Aulas aos sábados');

-- Inserir dados padrão para redes
INSERT IGNORE INTO redes (nome_rede, descricao) VALUES
('Municipal', 'Rede municipal de ensino'),
('Estadual', 'Rede estadual de ensino'),
('Fundação', 'Escolas de fundação'),
('Particular', 'Escolas particulares');
