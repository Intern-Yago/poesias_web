import { useState } from "react";
import { signIn as signInNext } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from 'react-hook-form';

import { AiOutlineGithub, AiOutlineGoogle, AiOutlineUser } from 'react-icons/ai';
import { FiLock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

import stylesForm from '../../styles/CampoLogin.module.css';
import styles from '../../styles/Login.module.css';
import stylesOthers from '../../styles/OtherLogins.module.css';

import { setCookie } from "nookies";
import Direcionar from "../../components/Direcionar";

export const getServerSideProps = async (ctx) => {
    return {
        props: {}
    }
}

export default function Login() {   
    const { register, handleSubmit } = useForm();
    const router = useRouter();
    
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    function handleFormSubmit(data) {
        setErrorMsg('');
        setSuccessMsg('');

        if (!data.email || !data.password) {
            setErrorMsg('Por favor, preencha o e-mail e a senha.');
            return;
        }

        setLoading(true);
        const nameFromEmail = data.email.includes('@') ? data.email.split('@')[0] : data.email;
        
        setCookie(undefined, 'token', `user_${Date.now()}`, {
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        });
        setCookie(undefined, 'user_name', nameFromEmail, {
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        });
        setCookie(undefined, 'user_email', data.email, {
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        });

        setSuccessMsg(`✨ Login realizado com sucesso! Bem-vindo(a), ${nameFromEmail}. Redirecionando...`);

        setTimeout(() => {
            router.push('/');
        }, 1200);
    }

    function handleSignInGithub() {
        setSuccessMsg('Redirecionando para autenticação com GitHub...');
        setCookie(undefined, 'token', `user_${Date.now()}`, {
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        });
        signInNext('github', { callbackUrl: '/' });
    }

    function handleSignInGoogle() {
        setSuccessMsg('Redirecionando para autenticação com Google...');
        setCookie(undefined, 'token', `user_${Date.now()}`, {
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        });
        signInNext('google', { callbackUrl: '/' });
    }

    return (
        <div className={styles.body}>
            <div className={styles.pop_up}>
                <div className={styles.fechar}>
                    <Direcionar to="/" text="Voltar para a página inicial" width="100" height="100"/>
                </div>

                <h2 style={{ fontFamily: 'Georgia, serif', color: '#4a3b30', marginBottom: '1rem', textAlign: 'center' }}>
                    Acessar Conta
                </h2>

                {errorMsg && (
                    <div style={{
                        backgroundColor: '#fde8e8',
                        color: '#9b1c1c',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}>
                        <FiAlertCircle /> {errorMsg}
                    </div>
                )}

                {successMsg && (
                    <div style={{
                        backgroundColor: '#def7ec',
                        color: '#03543f',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}>
                        <FiCheckCircle /> {successMsg}
                    </div>
                )}

                <form className={stylesForm.form} onSubmit={handleSubmit(handleFormSubmit)}>
                    <fieldset className="login grupo" style={{ border: 'none', padding: 0 }}>
                        <div className={stylesForm.campo}>
                            <label htmlFor="email">
                                <strong>Usuário / E-mail</strong>
                            </label>
                            <div className={stylesForm.inline}>
                                <AiOutlineUser/>
                                <input 
                                    {...register('email')}
                                    type="text" 
                                    name="email"
                                    id="email" 
                                    placeholder="Email ou Usuário"
                                    maxLength="100" 
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
                                <FiLock/>
                                <input 
                                    {...register('password')}
                                    type="password" 
                                    name="password"
                                    id="password" 
                                    placeholder="********"
                                    maxLength="100" 
                                    className={stylesForm.login} 
                                />
                            </div>
                        </div>
                    </fieldset>
                    <div className={styles.inline} style={{ marginTop: '1rem' }}>
                        <button type='submit' className={`${styles.botao} ${styles.logUp}`} disabled={loading}>
                            {loading ? 'Acessando...' : 'Acessar'}
                        </button>       
                        <Link href="/login/criar">
                            <a style={{textDecoration: 'none'}}>
                                <button type="button" className={`${styles.botao} ${styles.logIn}`}>
                                    Criar conta
                                </button>
                            </a>
                        </Link>
                    </div>
                </form>

                <div className={stylesOthers.line}></div>
                <div className={stylesOthers.other}>
                    <AiOutlineGithub className={stylesOthers.logInOther} title="Entrar com GitHub" onClick={handleSignInGithub}/>
                    <AiOutlineGoogle className={stylesOthers.logInOther} title="Entrar com Google" onClick={handleSignInGoogle}/>
                </div>
            </div>
        </div>
    )
}