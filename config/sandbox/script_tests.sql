CREATE DATABASE IF NOT EXISTS escolas_faceis;
USE escolas_faceis;

select * from usuarios where tipo_usuario = 'ADM';
select * from usuarios where tipo_usuario = 'Escola';
select * from usuarios where tipo_usuario = 'Comum';

SHOW TABLES;
DESCRIBE usuarios; 
DESCRIBE escolas;
DESCRIBE perfil_escola;
DESCRIBE avaliacoes;
DESCRIBE imagens_escola;


INSERT INTO usuarios (id_usuario, nome_usuario, email_usuario, telefone_usuario, senha_usuario, tipo_usuario, img_perfil_pasta, img_perfil_banco, biografia_usuario, status_usuario) VALUES (1, 'Ana Carolina', 'anaca.landim@gmail.com', '11960699510', 'maria555', 'ADM', '', '', 'biografia', 1);
