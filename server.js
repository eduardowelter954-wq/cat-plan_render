const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const SUPABASE_URL = "https://smnoqjpcphpoaronpfaz.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtbm9xanBjcGhwb2Fyb25wZmF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzQxNDM2NywiZXhwIjoyMTAyOTkwMzY3fQ.HwLKT08irZOBlW2yfJqmyhEV9ui76HcjzPDnHA4moxk";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

app.get('/', (req, res) => {
    res.send('Servidor do Cat-Plan conectado ao Supabase!');
});

// ROTA DE LOGIN (Agora devolve os dados do site junto!)
app.post('/api/auth', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ mensagem: "Usuário e senha são obrigatórios!" });
    }

    try {
        console.log(`Verificando usuário no Supabase: ${username}`);

        // 1. Verifica se o usuário já existe
        const { data: usuarioExistente } = await supabase
            .from('usuarios')
            .select('*')
            .eq('username', username)
            .maybeSingle();

        if (usuarioExistente) {
            console.log(`Usuário já cadastrado, login permitido: ${username}`);
            // Retorna a "mochila" com os dados do site que estavam no banco
            return res.json({ 
                mensagem: "Login realizado com sucesso!", 
                status: "ok",
                dados: usuarioExistente.dados_do_site 
            });
        }

        // 2. Se não existe, cadastra o novo usuário
        const { error: erroInsercao } = await supabase
            .from('usuarios')
            .insert([{ username, password }]);

        if (erroInsercao) {
            console.error('Erro ao inserir no Supabase:', erroInsercao);
            return res.status(500).json({ mensagem: "Erro ao salvar usuário no banco." });
        }

        console.log(`Novo usuário salvo com sucesso: ${username}`);
        return res.json({ 
            mensagem: "Cadastro e login realizados com sucesso!", 
            status: "ok",
            dados: null // Como é novo, ainda não tem dados
        });

    } catch (error) {
        console.error('Erro crítico no servidor:', error);
        res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
});

// NOVA ROTA: Salvar os dados do site
app.post('/api/dados', async (req, res) => {
    const { username, dados_do_site } = req.body;

    if (!username) {
        return res.status(400).json({ mensagem: "Usuário não informado!" });
    }

    try {
        const { error } = await supabase
            .from('usuarios')
            .update({ dados_do_site: dados_do_site })
            .eq('username', username);

        if (error) {
            console.error('Erro ao atualizar dados:', error);
            return res.status(500).json({ mensagem: "Erro ao salvar as tarefas no banco." });
        }

        return res.json({ mensagem: "Dados salvados na nuvem com sucesso!", status: "ok" });
    } catch (error) {
        console.error('Erro crítico ao salvar dados:', error);
        res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}!`);
});
