# OCR-LLM Frontend

## Descrição

Este é o frontend do projeto OCR-LLM, uma aplicação web que permite aos usuários fazer upload de documentos, obter o texto extraído (OCR) e solicitar explicações interativas sobre os dados extraídos (LLM). O frontend foi desenvolvido usando o framework Next.js e se comunica com um backend NestJS para gerenciar o processamento de OCR, integração com LLM e armazenamento dos resultados.

## Objetivo

O objetivo deste projeto é fornecer uma solução completa que permite aos usuários:

- Fazer upload de imagens de documentos.
- Obter o texto extraído dos documentos usando OCR.
- Solicitar explicações interativas sobre o texto extraído usando um modelo de linguagem (LLM).
- Visualizar uma lista de todos os documentos previamente carregados junto com as informações extraídas e interações LLM.
- Baixar os documentos com o texto extraído e interações LLM anexadas.

## Requisitos

- Node.js versão 16 ou superior
- npm (geralmente instalado com o Node.js)
- Backend OCR-LLM em execução (ver instruções no repositório do backend)

## Configuração e Execução Local

### 1. Clonar o Repositório

```bash
git clone https://github.com/Tales-Cunha/ocr-llm-frontend.git
cd ocr-llm-frontend
```
### 2. Instalar as Dependências

```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente
Crie um arquivo .env.local na raiz do projeto com o seguinte conteúdo:
* URL da API Backend
NEXT_PUBLIC_API_URL="http://localhost:3001"
* NEXT_PUBLIC_API_URL deve apontar para o endereço onde o backend está rodando.

### 3. Configurar as Variáveis de Ambiente

```bash
npm run dev
```
O aplicativo estará disponível em http://localhost:3000.

## Instruções de Uso

### Acessando o Site
1. Navegar para a Página de Login:

* Acesse a URL do site live: https://ocr-llm-frontend.onrender.com
* Faça login com suas credenciais. Se você não tiver uma conta, registre-se clicando no link "Registre-se". Pode usar as seguintes credenciais para teste:
```
email: admin@gmail.com
senha: admin123
```

2. Fazendo Upload de Documentos:

* Após o login, navegue até a página de upload.
* Clique no botão "Escolher arquivo" e selecione a imagem do documento que deseja fazer upload (JPEG, PNG ou PDF).
* Clique no botão "Upload" para enviar o documento.
Aguarde enquanto o documento é processado. Você verá um indicador de progresso.

3. Visualizando Documentos Carregados:

* Navegue até a página "Meus Documentos" para ver uma lista de todos os documentos que você carregou.
* Clique em um documento para ver o texto extraído e as interações LLM.

4. Solicitando Explicações Interativas:

* Na página de visualização do documento, digite uma pergunta sobre o texto extraído no campo de entrada.
* Clique no botão "Enviar" para obter uma explicação interativa do modelo de linguagem (LLM).

5. Baixando Documentos:

* Na página de visualização do documento, clique no botão "Baixar" para baixar o documento com o texto extraído e as interações LLM anexadas.

## Funcionalidades
* Upload de Documentos: Permite aos usuários fazer upload de imagens de documentos.
* Extração de Texto (OCR): Exibe o texto extraído dos documentos carregados.
* Interações LLM: Permite aos usuários solicitar explicações interativas sobre o texto extraído.
* Visualização de Documentos: Exibe uma lista de todos os documentos carregados anteriormente com as informações extraídas e interações LLM.
* Download de Documentos: Permite aos usuários baixar os documentos com o texto extraído e interações LLM anexadas.

## Problemas Comuns
* Erro de Conexão com o Backend: Verifique se o backend está em execução e acessível na URL configurada em NEXT_PUBLIC_API_URL.
* Portas Ocupadas: Certifique-se de que a porta 3000 não está sendo usada por outros serviços.

## Contato
Em caso de dúvidas ou problemas, por favor, abra uma issue no repositório ou entre em contato pelo email:

* Email: tvac@cin.ufpe.br