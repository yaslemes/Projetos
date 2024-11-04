const express = require("express"); // Importa o framework Express para criar o servidor
const exphbs = require("express-handlebars"); // Importa o mecanismo de template Handlebars
const mysql2 = require("mysql2"); // Importa o módulo mysql2 para conexão com o banco de dados
const app = express(); // Cria uma instância do aplicativo Express


// Configuração da conexão com o banco de dados MySQL
const connection = mysql2.createConnection({
    host: "localhost", // Endereço do servidor MySQL
    user: "root", // Nome de usuário do banco de dados
    database: "sapatinhodecristal", // Nome do banco de dados
    password: "280223" // Senha do usuário
});

// Configuração do motor de template Handlebars
app.engine('handlebars', exphbs.engine({ defaultLayout: 'default' })); // Define o layout padrão
app.set('view engine', 'handlebars'); // Define Handlebars como o motor de visualização
app.set('views', './views'); // Define o diretório das views


// Conexão com o banco de dados
connection.connect((err) => {
    if (err) {
        console.log(err); // Loga o erro caso a conexão falhe
    } else {
        console.log("conectado com sucesso"); // Mensagem de sucesso na conexão
    }
});

// Rota principal da aplicação
app.get("/", (req, res) => {
    // Consulta SQL para obter dados sobre vendas, comissões e funcionários
    connection.query(`SELECT v.id_venda, v.data_venda, pg.valor, p.nome_pessoa, 
        ROUND((pg.valor * f.taxa_comissao), 2) AS comissao_venda
        FROM venda v, pagamento pg, pessoa p, funcionario f, cargo c
        WHERE p.cpf_pessoa = f.pessoa_cpf_pessoa 
        AND f.pessoa_cpf_pessoa = v.funcionario_pessoa_cpf_pessoa1 
        AND f.cargo_id_cargo = c.id_cargo 
        AND v.id_venda = pg.venda_id_venda;`, (err, result) => {
        
        // Formata a data de cada resultado
        for (let i = 0; i < result.length; i++) {
            result[i].data_venda = extrairData(result[i].data_venda); // Converte a data para o formato desejado
        }
        
        console.log(result); // Loga o resultado da consulta
        res.render("projetobd", { dados: result }); // Renderiza a view "atividade" passando os dados
    });
});

// Função para extrair e formatar a data
function extrairData(data) {
    const data2 = new Date(data); // Converte a string de data em um objeto Date
    return data2.toISOString().split('T')[0]; // Retorna a data no formato 'YYYY-MM-DD'
}

// Inicia o servidor na porta 8080
app.listen(8080);
