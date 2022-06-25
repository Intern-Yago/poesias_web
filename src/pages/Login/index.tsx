import {FiMail, FiLock} from 'react-icons/fi'
import {AiOutlineGoogle, AiOutlineGithub} from 'react-icons/ai'

import './styles/stylesLogin.css'

export function Login(){    
    return(
        <div id="pop" className="login body activate">
            <div id="pop-up" className="login">
                <button className="login fechar" >X</button>
                <form>
                    <fieldset className="login grupo">
                        <div className="login campo">
                            <label htmlFor="nome"><strong>Login</strong></label>
                            <div className="login inline">
                                <FiMail/>
                                <input type="email" name="nome" id="nome" placeholder="Acesso" maxLength="100" className="login"/>
                            </div>
                        </div>
                        <div className="login campo">
                            <label htmlFor="sobrenome"><strong>Senha</strong></label>
                            <div className="login inline">
                                <FiLock/>
                                <input type="password" name="sobrenome" id="sobrenome" placeholder="*******" maxLength="100" className="login"/>
                            </div>
                            <a href="#" className="login">
                                <p className="login forgot">Esqueceu a senha?</p>
                            </a>
                        </div>
                    </fieldset> 
                </form>
                <div className="login inline">
                    <a href="#" className="login">
                        <button type="submit" className='login botao logUp'>
                            Criar conta
                        </button>
                    </a>
                    <a href="#" className="login">
                        <button type='submit' className='login botao logIn'>
                            Acessar
                        </button>       
                    </a>
                </div>
                <div className='login line'>
                </div>
                <div className="login other">
                    <AiOutlineGithub className='login logInOther'/>
                    <AiOutlineGoogle className='login logInOther'/>
                </div>
            </div>
        </div>
    )
}