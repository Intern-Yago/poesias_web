import { useState } from "react";
import { useForm } from 'react-hook-form';
import { AiOutlineUser } from 'react-icons/ai';
import { FiLock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Link from "next/link";
import { useRouter } from "next/router";
import { setCookie } from "nookies";

import styles from '../../styles/Login.module.css';
import Direcionar from "../../components/Direcionar";
import stylesForm from '../../styles/CampoLogin.module.css';

export default function Criar() {    
    const { register, handleSubmit } = useForm();
    const router = useRouter();

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    
    async function handleFormSubmit(data) {
        setErrorMsg('');
        setSuccessMsg('');

        if (!data.email || !data.password) {
            setErrorMsg('Por favor, informe o e-mail e a senha para criar a conta.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password
                })
            });

            const resData = await res.json();
            if (!res.ok) {
                throw new Error(resData.error || 'Erro ao criar conta.');
            }

            const userName = resData.user?.name || data.email.split('@')[0];

            setCookie(undefined, 'token', `user_${Date.now()}`, {
                maxAge: 60 * 60 * 24 * 7,
                path: '/'
            });
            setCookie(undefined, 'user_name', userName, {
                maxAge: 60 * 60 * 24 * 7,
                path: '/'
            });
            setCookie(undefined, 'user_email', data.email, {
                maxAge: 60 * 60 * 24 * 7,
                path: '/'
            });

            setSuccessMsg(`🎉 Conta criada com sucesso! Seja bem-vindo(a), ${userName}. Redirecionando...`);

            setTimeout(() => {
                router.push('/');
            }, 1200);
        } catch (err) {
            setErrorMsg(err.message || 'Erro ao comunicar com o servidor.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.body}>
            <div className={styles.pop_up}>
                <div className={styles.fechar}>
                    <Direcionar to="/" text="Voltar para a página inicial" width="100" height="100"/>
                </div>

                <h2 style={{ fontFamily: 'Georgia, serif', color: '#4a3b30', marginBottom: '1rem', textAlign: 'center' }}>
                    Criar Nova Conta
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

                <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
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
                                    placeholder="Seu email ou usuário"
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
                                    placeholder="Crie uma senha"
                                    maxLength="100" 
                                    className={stylesForm.login} 
                                />
                            </div>
                        </div>
                    </fieldset>
                    <div className={styles.inline} style={{ marginTop: '1rem' }}>
                        <button type="submit" className={`${styles.botao} ${styles.logUp}`} disabled={loading}>
                            {loading ? 'Criando...' : 'Criar conta'}
                        </button>      
                        <Link href="/login">
                            <a style={{textDecoration: 'none'}}>
                                <button type='button' className={`${styles.botao} ${styles.logIn}`}>
                                    Já tenho conta
                                </button> 
                            </a>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}