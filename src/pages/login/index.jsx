import { useState } from "react";
import { getSession, signIn as signInNext } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from 'react-hook-form';
import { setCookie } from "nookies";

import { AiOutlineGithub, AiOutlineGoogle, AiOutlineUser } from 'react-icons/ai';
import { FiLock, FiArrowLeft, FiUserCheck } from 'react-icons/fi';

import stylesForm from '../../styles/CampoLogin.module.css';
import styles from '../../styles/Login.module.css';
import stylesOthers from '../../styles/OtherLogins.module.css';

export const getServerSideProps = async (ctx) => {
    const session = await getSession(ctx)
    const cookies = ctx.req.cookies || {}

    if (session || cookies.token) {
        return {
            redirect: {
                destination: '/poeta',
                permanent: false
            }
        }
    }
    return {
        props: {}
    }
}

export default function Login() {   
    const { register, handleSubmit } = useForm();
    const router = useRouter();
    const [infoMsg, setInfoMsg] = useState('');

    function handleFormLogin(data) {
        if (!data.email) {
            setInfoMsg('Por favor, informe seu email ou nome de usuário.');
            return;
        }

        // Quick login token for guest writing mode
        setCookie(undefined, 'token', `user_${Date.now()}`, {
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/'
        });

        router.push('/poeta');
    }

    function handleSignInGithub() {
        signInNext('github', { callbackUrl: '/poeta' });
    }

    function handleSignInGoogle() {
        signInNext('google', { callbackUrl: '/poeta' });
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
                    <h2>Entrar no Poesias</h2>
                    <p>Conecte-se para publicar suas obras e versos</p>
                </div>

                {infoMsg && <div className={styles.noticeBox}>{infoMsg}</div>}

                <form className={stylesForm.form} onSubmit={handleSubmit(handleFormLogin)}>
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
                            <FiUserCheck /> Entrar
                        </button>       
                        
                        <Link href="/login/criar">
                            <a style={{ textDecoration: 'none' }}>
                                <button type="button" className={`${styles.botao} ${styles.logIn}`}>
                                    Criar Conta
                                </button>
                            </a>
                        </Link>
                    </div>
                </form>

                <div className={stylesOthers.line}>
                    <span>ou acesse com</span>
                </div>

                <div className={stylesOthers.other}>
                    <button 
                        type="button"
                        onClick={handleSignInGithub} 
                        className={stylesOthers.socialBtn}
                        title="Conectar com GitHub"
                        aria-label="Conectar com GitHub"
                    >
                        <AiOutlineGithub /> GitHub
                    </button>
                    
                    <button 
                        type="button"
                        onClick={handleSignInGoogle} 
                        className={stylesOthers.socialBtn}
                        title="Conectar com Google"
                        aria-label="Conectar com Google"
                    >
                        <AiOutlineGoogle /> Google
                    </button>
                </div>
            </div>
        </div>
    )
}