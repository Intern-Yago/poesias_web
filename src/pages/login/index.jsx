import { getSession, signIn as signInNext } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from 'react-hook-form';

import { AiOutlineGithub, AiOutlineGoogle, AiOutlineUser } from 'react-icons/ai';
import { FiLock } from 'react-icons/fi';

import stylesForm from '../../styles/CampoLogin.module.css';
import styles from '../../styles/Login.module.css';
import stylesOthers from '../../styles/OtherLogins.module.css';

import { parseCookies, setCookie } from "nookies";
import Direcionar from "../../components/Direcionar";

export const getServerSideProps = async (ctx) => {
    return {
        props: {}
    }
}

export default function Login() {   
    const { register, handleSubmit } = useForm()
    const router = useRouter()
    
    function handleFormSubmit(data) {
        setCookie(undefined, 'token', `user_${Date.now()}`, {
            maxAge: 60 * 60 * 24,
            path: '/'
        })
        router.push('/poeta')
    }

    function handleSignInGithub() {
        setCookie(undefined, 'token', `user_${Date.now()}`, {
            maxAge: 60 * 60 * 24,
            path: '/'
        })
        signInNext('github', { callbackUrl: '/poeta' })
    }

    function handleSignInGoogle() {
        setCookie(undefined, 'token', `user_${Date.now()}`, {
            maxAge: 60 * 60 * 24,
            path: '/'
        })
        signInNext('google', { callbackUrl: '/poeta' })
    }

    return (
        <div className={styles.body}>
            <div className={styles.pop_up}>
                <div className={styles.fechar}>
                    <Direcionar to="/" text="Voltar para a página inicial" width="100" height="100"/>
                </div>
                <form className={stylesForm.form} onSubmit={handleSubmit(handleFormSubmit)}>
                    <fieldset className="login grupo">
                        <div className={stylesForm.campo}>
                            <label htmlFor="user">
                                <strong>
                                    Usuário
                                </strong>
                            </label>
                            <div className={stylesForm.inline}>
                                <AiOutlineUser/>
                                <input 
                                    {...register('email')}
                                    type="text" 
                                    name="email"
                                    id="email" 
                                    placeholder="Email"
                                    maxLength="100" 
                                    className={stylesForm.login} 
                                    autoComplete="email"
                                />
                            </div>
                        </div>
                        <div className={stylesForm.campo}>
                            <label htmlFor="password">
                                <strong>
                                    Senha
                                </strong>
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
                    <div className={styles.inline}>
                        <button type='submit' className={`${styles.botao} ${styles.logUp}`}>
                            Acessar
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
                    <AiOutlineGithub className={stylesOthers.logInOther} onClick={handleSignInGithub}/>
                    <AiOutlineGoogle className={stylesOthers.logInOther} onClick={handleSignInGoogle}/>
                </div>
            </div>
        </div>
    )
}