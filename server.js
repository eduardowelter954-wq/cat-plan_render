const express = require('express');
const cors = require('cors');

const app = express();

// Configurações para o servidor entender os dados do front-end
app.use(cors());
app.use(express.json());

// Rota básica para o Render saber que o servidor está vivo
app.get('/', (req, res) => {
    res.send('Servidor do Cat-Plan está online na nuvem! 🐈‍⬛');
});

// Rota que vai receber os dados de login/cadastro
app.post('/api/auth', (req, res) => {
    const { username, password } = req.body;
    
    // Por enquanto, vamos apenas ver se a informação chegou!
    console.log(`Tentativa de acesso recebida - Usuário: ${username}, Senha: ${password}`);
    
    // Responde ao front-end para ele não ficar carregando infinitamente
    res.json({ mensagem: "Dados recebidos pelo servidor com sucesso!" });
});

// PORTA DINÂMICA: Essencial para o Render funcionar!
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor do Cat-Plan rodando na porta ${PORT}! 🐈‍⬛`);
});