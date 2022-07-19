require('dotenv').config()
const express = require('express')
const app = express()
const cors =  require('cors')
const mysql = require('mysql')

const db = mysql.createPool({
    host: process.env.HOST_DB,
    user:process.env.USER_DB,
    password: process.env.SENHA_DB,
    database:process.env.DB
})

app.use(express.json())
app.use(cors())

app.post("/register", (req,res)=>{
    const autorizar  = req.body.usuario.autorizar
    const email = req.body.usuario.email
    const senha = req.body.usuario.senha
    const user = req.body.usuario.user
    console.log(autorizar);
    if(autorizar == true){
        db.query(`select * from usuarios where email = "${email}" or user = "${user}"`, (err,result)=>{
            if(err){
                res.send(err)
            }
            else if(result.length == 0){
                db.query(`insert into usuarios (email,senha,user) values ("${email}","${senha}","${user}")`, (err,result)=>{
                    if(err){
                        res.send(err)
                    }
                    res.send({msg: "Cadastrado com sucesso", type: 'success'})
                })
            }
            else{
                res.send({msg:"Usuário já existe", type: 'error'})
            }
        })
    }
    else{
        res.send({msg:"Não estamos aceitando novo usuários", type:'error'})
    }
})

app.post("/login", (req,res)=>{
    const user = req.body.usuario.user
    const senha = req.body.usuario.senha
    db.query(`select * from usuarios where user = "${user}" and senha = "${senha}"`, (err,result)=>{
        if(err){
            res.send(err);
        }
        if(result.length > 0){
            res.send({msg: "Usuário logado com sucesso", type: 'success'})
        }
        else{
            res.send({msg: "Conta não encontrada", type: 'error'})
        }
    })
})

app.listen(3001, () =>{
    console.log("Servidor rodando na porta 3001");
})
