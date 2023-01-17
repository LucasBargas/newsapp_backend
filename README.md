## Projeto NewsLBS
O projeto **NewsLBS** foi desenvolvido por mim, Lucas Bargas, com base em um layout que encontrei na web.
Contruí uma API Rest para ser consumida no Front end. Todos os testes de rotas foram feitos com o Postman.
Este projeto tem como objetivo simular um portal de notícias, porém com um visual mais simples.

### Principais recursos do App
* Registo, login e logout de usuário;
* Edição de usuário, somente autenticado;
* Registro, edição e exclusão de Notícia, somente autenticado;
* A edição ou exclusão só pode ser feita por quem postou a notícia.

### Tecnologias utilizadas
#### Backend
<table>
  <tr>
    <td>Nodejs</td>
    <td>Express-js</td>
    <td>Mongoose</td>
    <td>JWT</td>
    <td>Bcrypt</td>
  </tr>
  <tr>
    <td>19.2</td>
    <td>4.18</td>
    <td>6.8</td>
    <td>9.0</td>
    <td>5.1</td>
  <tr>
</table>

### Como executar este Backend

#### Pré-requisitos
Possuir o Nodejs instalado.

#### Clone o repositório
```bash
git clone https://github.com/LucasBargas/newslbs_backend.git
```

#### Entre na pasta
```bash
cd newslbs_backend
```

#### Instale as dependências
```bash
npm install
```

#### Configure as variáveis de ambiente
```bash
# Crie um arquivo .env e passe os valores
MONGO_URL=value
JWT_SECRET=value
```

#### Execute o App
```bash
npm start
```

# Autor
Lucas Bargas da Silva
</br>
<https://projetoslucasbargas.vercel.app/>
</br>
<https://www.linkedin.com/in/lucas-bargas/>


Gostaria de ver o repositório do Front end deste app?
[Clique aqui](https://github.com/LucasBargas/newslbs_frontend)
