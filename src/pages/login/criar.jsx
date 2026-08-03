import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineUser } from 'react-icons/ai';
import { FiLock, FiArrowLeft, FiUserPlus } from 'react-icons/fi';
import Link from "next/link";
import { useRouter } from "next/router";
import { setCookie } from "nookies";

import styles from '../../styles/Login.module.css';
import stylesForm from '../../styles/CampoLogin.module.css';

export default function Criar() {    
    const { register, handleSubmit } = useForm();
    const router = useRouter();
    const [infoMsg, setInfoMsg] = useState('');

    function handleCreateAccount(data) {
        if (!data.email) {
            setInfoMsg('Por favor, informe seu email ou nome de usuário.');
            return;
        }

        setCookie(undefined, 'token', `user_${Date.now()}`, {
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/'
        });

        router.push('/poeta');
    }

    return (
        <div className={styles.body}>
            <div className={styles.pop_up}>
                <div className={styles.fechar}>
                    <Link href="/">
                        <a className={styles.btnVoltar}>
                            <FiArrowLeft /> Voltar para o Início
                        </a>
                    </Link>
                </div>

                <div className={styles.loginHeader}>
                    <h2>Criar Conta</h2>
                    <p>Cadastre-se para começar a escrever suas poesias</p>
                </div>

                {infoMsg && <div className={styles.noticeBox}>{infoMsg}</div>}

                <form className={stylesForm.form} onSubmit={handleSubmit(handleCreateAccount)}>
                    <div className={stylesForm.campo}>
                        <label htmlFor="email">
                            <strong>Usuário ou Email</strong>
                        </label>
                        <div className={stylesForm.inline}>
                            <AiOutlineUser />
                            <input 
                                {...register('email', { required: true })}
                                type="text" 
                                name="email"
                                id="email" 
                                placeholder="seu@email.com ou Nome"
                                maxLength={100} 
                                className={stylesForm.login} 
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className={stylesForm.campo}>
                        <label htmlFor="password">
                            <strong>Senha</strong>
                        </label>
                        <div className={stylesForm.inline}>
                            <FiLock />
                            <input 
                                {...register('password')}
                                type="password" 
                                name="password"
                                id="password" 
                                placeholder="••••••••"
                                maxLength={100} 
                                className={stylesForm.login} 
                            />
                        </div>
                    </div>

                    <div className={styles.inline}>
                        <button type="submit" className={`${styles.botao} ${styles.logUp}`}>
                            <FiUserPlus /> Criar Conta
                        </button>      

                        <Link href="/login">
                            <a style={{ textDecoration: 'none' }}>
                                <button type="button" className={`${styles.botao} ${styles.logIn}`}>
                                    Já Tenho Conta
                                </button> 
                            </a>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}