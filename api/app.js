const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

require('./models/Orcamento');
const Orcamento = mongoose.model('Orcamento');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization");
    app.use(cors());
    next();
});

mongoose.connect('mongodb://localhost/celke', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => {
    console.log("Conexão com o BD MongoDB realizado com sucesso!");
}).catch((err) => {
    console.log("Erro: Conexão com BD MongoDB não realizado com sucesso: " + err);
});

app.post('/orcamento', async (req, res) => {
    console.log(req.body);
    await Orcamento.create(req.body, (err) => {
        if(err) return res.status(400).json({
            error: true,
            message: "Erro: Solicitação de orçamento não enviada!"
        });
    });

    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "20a57d7734ee76",
          pass: "7aaf091ffa5855"
        }
    });

    var emailHtml = 'Prezado(a)<br><br> Recebi a solicitação de orçamento.<br><br>Em breve o mesmo será encaminhado.<br><br>';

    var emailTexto = 'Prezado(a)\n\n Recebi a solicitação de orçamento.\n\nEm breve o mesmo será encaminhado.\n\n'

    var emailSendInfo = {
        from: '18670f753d-bbff56@inbox.mailtrap.io', // sender address
        to: req.body.email, // list of receivers
        subject: "Recebi a solicitação de orçamento", // Subject line
        text: emailTexto, // plain text body
        html: emailHtml, // html body
    }

    await transport.sendMail(emailSendInfo, function(err){
        if(err) return res.status(400).json({
            error: true,
            message: "Erro: Solicitação de orçamento não enviada!"
        });

        return res.json({
            error: false,
            message: "Solicitação de orçamento enviada com sucesso!"
        });
    });

    return res.json({
        error: false,
        message: "Solicitação de orçamento enviada com sucesso!"
    });
    res.json('Orçamento Celke');
});

app.listen(8080, () => {
    console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});