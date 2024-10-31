const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();


app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'segredo',
  resave: false,
  saveUninitialized: true,
}));

const usuarios = [];

app.get('/',(req,res) =>{
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.send(`
    <form action="/login" method="POST">
      <input type="text" name="nome" placeholder="Usuário"/>
      <input type="password" name="senha" placeholder="Senha"/>
      <button type="submit">Login</button>
    </form>
    <p>Não possui uma conta ? <a href="/cadastrar">Cadastrar</a></p>
  `);
});

app.get('/cadastrar', (req, res) => {
  res.send(`
    <form action="/cadastrar" method="POST">
      <input type="text" name="nome" placeholder="Usuário"/>
      <input type="password" name="senha" placeholder="Senha"/>
      <button type="submit">Registrar</button>
    </form>
    <p>Já possui uma conta? <a href="/login">Login</a></p>
  `);
});


app.post('/cadastrar', (req, res) => {
  const { nome, senha } = req.body;

  const usuarioExiste = usuarios.find(u => u.nome === nome);
  
  if (usuarioExiste) {
    res.send('Nome de usuário já existe! <a href="/cadastrar">Tente novamente</a>');
  } else {
    usuarios.push({ nome: nome, senha: senha });
    res.send('Usuário registrado com sucesso! <a href="/login">Faça login</a>');
  }
});

app.post('/login', (req, res) => {
  const { nome, senha } = req.body;

  const usuario = usuarios.find(u => u.nome === nome && u.senha === senha);
  
  if (usuario) {
    req.session.nome = nome; 
    res.redirect('/inicio'); 
  } else {
    res.send('Nome de usuário ou senha inválidos! <a href="/login">Tente novamente</a>');
  }
});

function authMiddleware(req, res, next) {
  if (req.session.nome) {
    next();
  } else {
    res.send('Acesso negado! <a href="/login">Faça Login</a>');
  }
}

app.get('/inicio', authMiddleware, (req, res) => {
  res.send(`Bem-vindo ${req.session.nome}! <a href="/logout">Logout</a>`);
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.listen(3000, () => {
  console.log(`Deu boa`);
});
