## Estrutura do Projeto

```plaintext
frontend-finx/
├── node_modules/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   ├── views/
│   ├── App.vue
│   ├── main.js
│   └── router.js
├── .gitignore
├── babel.config.js
├── package.json
├── README.md
└── vue.config.js
```

## Como Rodar o Projeto

1. Clone o repositório:
    ```sh
    git clone https://github.com/seu-usuario/frontend-finx.git
    cd frontend-finx
    ```

2. Instale as dependências:
    ```sh
    npm install
    ```

3. Rode o servidor de desenvolvimento:
    ```sh
    npm run serve
    ```

4. Acesse o projeto no navegador:
    ```
    http://localhost:8080
    ```

## Scripts Disponíveis

- `npm run serve`: Compila e recarrega o projeto para desenvolvimento.
- `npm run build`: Compila e minifica o projeto para produção.
- `npm run lint`: Verifica e corrige problemas no código.

## Configuração Adicional

Para mais detalhes sobre a configuração do projeto, consulte a [Referência de Configuração](https://cli.vuejs.org/config/).

## Contribuindo

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`).
4. Faça push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
