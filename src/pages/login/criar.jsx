import { useForm } from 'react-hook-form';
import { AiOutlineUser } from 'react-icons/ai';
import { FiLock } from 'react-icons/fi';
import Link from "next/link";
import { useRouter } from "next/router";
import { setCookie } from "nookies";

import styles from '../../styles/Login.module.css';
import Direcionar from "../../components/Direcionar";
import stylesForm from '../../styles/CampoLogin.module.css';

export default function Criar() {    
    const { register, handleSubmit } = useForm()
    const router = useRouter()
    
    function handleFormSubmit(data) {
        setCookie(undefined, 'token', `user_${Date.now()}`, {
            maxAge: 60 * 60 * 24,
            path: '/'
        })
        router.push('/poeta')
    }

    return (
        <div className={styles.body}>
            <div className={styles.pop_up}>
                <div className={styles.fechar}>
                    <Direcionar to="/" text="Voltar para a página inicial" width="100" height="100"/>
                </div>
                <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
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
                        <button type="submit" className={`${styles.botao} ${styles.logUp}`}>
                            Criar conta
                        </button>      
                        <Link href="/login" className={styles.a}>
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