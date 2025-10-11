# TODO: Carregar Fotos de Perfil das Escolas em Perfil-Escola, Perfil-Escola-E e Encontre-Escolas

## Passos para Implementar o Plano

- [x] **Atualizar consultas no modelo escolaModel.js**: Modificar as funções findAllSorted, findPage e searchAndFilterSchools para incluir JOIN com a tabela imagens e selecionar img_perfil_pasta (caminho da imagem). Isso garantirá que as listas de escolas tragam o caminho da foto de perfil.

- [x] **Modificar controlador escolaController.js**: Na função mostrarPerfil, adicionar img_perfil_banco e img_perfil_pasta aos objetos 'campos' e 'valores' passados para as views perfil-escola.ejs e perfil-escola-e.ejs. Isso corrigirá a exibição da foto nas páginas de perfil.

- [x] **Corrigir view encontre-escolas.ejs**: Substituir a referência incorreta a 'valores.img_perfil_banco || valores.img_perfil_pasta' por 'escola.img_perfil_pasta || '../imagem/escola-padrao.png'' no src da imagem, para exibir a foto de cada escola na lista.

## Notas
- Após cada passo, verificar se as mudanças foram aplicadas com sucesso via feedback do usuário.
- Testar as páginas após todas as atualizações para confirmar que as fotos carregam corretamente.
- Se necessário, adicionar handling para img_perfil_banco (dados binários) nas listas, mas priorizar caminho da pasta para performance.
