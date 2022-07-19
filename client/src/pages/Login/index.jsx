import React from "react";
import {FiMail, FiLock} from 'react-icons/fi'
import {AiOutlineUser} from 'react-icons/ai'
import Axios from 'axios'

import styles from './styles.module.css'

import { Link, useNavigate } from 'react-router-dom'
import { LoginCampo } from '../../components/CampoLogin'
import { OtherLogins } from '../../components/OtherLogins'
import { Direcionar } from "../../components/Direcionar";
import { useState } from "react";
import { Message } from "../../components/Message";


export function Criar(){
    const navigate = useNavigate()
    const [message, setMessage] = useState('')
    const [usuario, setUsuario] = useState({})
    const [type, setType] = useState()
    const handleRegister = () => {
        setMessage('')
        usuario.autorizar = false
        Axios.post("http://localhost:3001/register",{
            usuario:usuario
        })
        .then(resp => {
            setMessage(resp.data.msg)
            setType(resp.data.type)
            if(resp.data.type=="success"){
                setTimeout(()=>{
                    navigate("/poeta")
                },2000)
            }else{
                setUsuario({["email"]:''})
                setUsuario({["senha"]:''})
                setUsuario({["user"]:''})
                console.log(usuario);
            }
        })
        .catch(err => console.log(err))
    };

    function handleChange(e){
        setUsuario({...usuario, [e.target.name]:e.target.value})
    }

    return(
        <div className={styles.body}>
            <div className={styles.pop_up}>
            {message && <Message type={type} msg={message}/>}
                <div className={styles.fechar}>
                    <Direcionar to="/" text="Voltar para a página inicial"/>
                </div>
                <form className={styles.form}>
                    <fieldset className="login grupo">
                        <LoginCampo 
                            icon={<AiOutlineUser/>} 
                            funcao="user" 
                            mensagem="Usuário" 
                            type='text' 
                            func={handleChange} 
                            value={usuario.user ? usuario.user:''}
                        />

                        <LoginCampo icon={<FiMail/>} funcao="email" mensagem="Email" type="email" func={handleChange} value={usuario.email ? usuario.email: ''}/>
                        <LoginCampo icon={<FiLock/>} funcao="senha" mensagem='*******' type="password" func={handleChange} value={usuario.senha?usuario.senha:''}/>
                    </fieldset> 
                <div className={styles.inline}>
                    <button type="button" className={`${styles.botao} ${styles.logUp}`} onClick={handleRegister}>
                        Criar conta
                    </button>
                    <Link to="/login" className={styles.a}>
                        <button type='button' className={`${styles.botao} ${styles.logIn}`}>
                            Já tenho conta
                        </button>       
                    </Link>
                </div>
                </form>
                <OtherLogins/>
            </div>
        </div>
    )
}

export function Login(){    
    const navigate = useNavigate()
    const [message, setMessage] = useState('')
    const [usuario, setUsuario] = useState({})
    const [type, setType] = useState()

    const handleLogin = () => {
        setMessage('')
        Axios.post("http://localhost:3001/login",{
            usuario:usuario
        })
        .then(resp => {
            setMessage(resp.data.msg)
            console.log(resp);
            setType(resp.data.type)
            if(resp.data.type=="success"){
                setTimeout(()=>{
                    navigate("/poeta")
                },2000)
            }else{
                setUsuario({["user"]:''})
                setUsuario({["senha"]:''})
                console.log(usuario);
            }
        })
        .catch(err => console.log(err))
    };
    function handleChange(e){
        setUsuario({...usuario, [e.target.name]:e.target.value})
    }
    return(
        <div className={styles.body}>
            <div className={styles.pop_up}>
                {message && <Message type={type} msg={message}/>}
                <div className={styles.fechar}>
                    <Direcionar to="/" text="Voltar para a página inicial"/>
                </div>
                <form className={styles.form}>
                    <fieldset className="login grupo">
                        <LoginCampo funcao='user' mensagem='Usuário' type="text" icon={<AiOutlineUser/>} func={handleChange} value={usuario.user?usuario.user:''}/>
                        <LoginCampo funcao='senha' mensagem='*******' type="password" icon={<FiLock/>} func={handleChange} value={usuario.senha?usuario.senha:''}/>
                        <a href="#" className={styles.a}>
                            <p className={styles.forgot}>Esqueceu a senha?</p>
                        </a>
                    </fieldset> 
                <div className={styles.inline}>
                    <a href="#" className={styles.a}>
                        <button type='button' className={`${styles.botao} ${styles.logUp}`} onClick={handleLogin}>
                            Acessar
                        </button>       
                    </a>
                    <Link to={"/login/criar"} className={styles.a}>
                        <button type="button" className={`${styles.botao} ${styles.logIn}`}>
                            Criar conta
                        </button>
                    </Link>
                </div>
                </form>
                <OtherLogins/>
            </div>
        </div>
    )
}