import { getSession, signIn as signInNext } from "next-auth/react";
import Link from "next/link";
import { useForm } from 'react-hook-form';

import { AiOutlineGithub, AiOutlineGoogle, AiOutlineUser } from 'react-icons/ai';
import { FiLock } from 'react-icons/fi';

import stylesForm from '../../styles/CampoLogin.module.css';
import styles from '../../styles/Login.module.css';
import stylesOthers from '../../styles/OtherLogins.module.css';

import { parseCookies, setCookie } from "nookies";
import { v4 as uuid } from 'uuid';
import Direcionar from "../../components/Direcionar";

export const getServerSideProps = async (ctx)=>{
    const session = await getSession(ctx['req'])
    const {token} = parseCookies(ctx)
    if(session || token){
        return{
            redirect:{
                destination:'/poeta',
                permanent: false
            }
        }
    }
    return{
        props:{

        }
    }
}

export default function Login(){   
    const {register, handleSubmit} = useForm()
    
    function handleSignIn(){
        alert("Lamentamos informar que atualmente o site passa por reformas...\nPor favor conecte-se com contas sociais")
    }

    function handleSignInGithub(){
        setCookie(undefined, 'token', uuid(), {
            maxAge: 60 * 60 * 1, // 1 hour
          })
        signInNext('github')
    }

    return(
        
        <div className={styles.body}>
            <div className={styles.pop_up}>
                <div className={styles.fechar}>
                    <Direcionar to="/" text="Voltar para a página inicial" width="100" height="100"/>
                </div>
                <form className={stylesForm.form} method="POST" onSubmit={handleSignIn}>
                    <fieldset className="login grupo">
                    <div className={stylesForm.campo}>
                        <label htmlFor="user">
                            <strong>
                                Uusário
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
                        <a href="#" className={styles.a}>
                            <p className={styles.forgot}>Esqueceu a senha?</p>
                        </a>
                    </fieldset>
                    <div className={styles.inline}>
                    <a className={styles.a}>
                        <button type='submit' className={`${styles.botao} ${styles.logUp}`}>
                            Acessar
                        </button>       
                    </a>
                    <Link href="/login/criar" className={styles.a}>
                        <a style={{textDecoration: 'none'}}>
                            <button type="button" className={`${styles.botao} ${styles.logIn}`}>
                                Criar conta
                            </button>
                        </a>
                    </Link>
                    </div>
                </form>
                <div className={stylesOthers.line}>
                    </div>
                    <div className={stylesOthers.other}>
                        <AiOutlineGithub className={stylesOthers.logInOther} onClick={handleSignInGithub}/>
                        <AiOutlineGoogle className={stylesOthers.logInOther}/>
                    </div>
                </div>
        </div>
    )
}