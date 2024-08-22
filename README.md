# Como executar

- Criar PAT com a permissão Release (Read, write, execute & manage);
- Criar arquivo .env com base no arquivo .env.example;
- Preencher parâmetros do arquivo .env:
  - APPSETTINGS_PATH: Caminho para o arquivo appsetting de onde as variáveis serão coletadas;
  - PAT: O Personal Access Token criado;
  - AZURE_DEVOPS_URL: A URL do azure devops contendo a organization;
  - AZURE_PROJECT: O nome do projeto no azure devops onde está o release pipeline;
  - STAGE: O nome do stage que receberá as variáveis (já deve estar criado);
  - RELEASE_DEFINITION_ID: O identificador da definição da release. Deve ser obtido do parâmetro query string definitionId quando se abre uma release para edição;
  - IGNORED_PROPERTIES_PATTERN: O padrão utilizado para identificar propriedades que serão desconsideradas na leitura do arquivo appsettings (aceita wildcards);
  - SECRET_PROPERTIES_PATTERN: O padrão utilizado para identificar propriedades que devem ser tratadas como secrets e criptografas ao criar as variáveis no azure devops (aceita wildcards).
  - DRY_RUN: Quando ativado (true), realiza a conversão do arquivo appsettings em variáveis de pipeline mas NÃO atualiza a release (utilizado para validação das variáveis antes de aplicar efetivamente).
- Executar o projeto com F5 (Launch Program).
