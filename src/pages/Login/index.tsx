import {FiMail, FiLock} from 'react-icons/fi'
import {AiOutlineGoogle, AiOutlineGithub, AiOutlineUser} from 'react-icons/ai'

import './styles/stylesLogin.css'
import { Link } from 'react-router-dom'
import { LoginCampo } from '../../components/CampoLogin'
import { OtherLogins } from '../../components/OtherLogins'

export function Criar(){
    return(
        <div id="pop" className="login body activate">
            <div id="pop-up" className="login">
                <form>
                    <fieldset className="login grupo">
                        <LoginCampo icon={<AiOutlineUser/>} funcao="user" mensagem="Usuário" type='text'/>
                        <LoginCampo icon={<FiMail/>} funcao="email" mensagem="Email" type="email"/>
                        <LoginCampo icon={<FiLock/>} funcao="senha" mensagem='*******' type="password"/>
                    </fieldset> 
                </form>
                <div className="login inline">
                    <a href="#" className="login">
                        <button type="submit" className='login botao logUp'>
                            Criar conta
                        </button>
                    </a>
                    <Link to="/login" className='login'>
                        <button type='submit' className='login botao logIn'>
                            Já tenho conta
                        </button>       
                    </Link>
                </div>
                <OtherLogins/>
            </div>
        </div>
    )
}

export function Login(){    
    return(
        <div id="pop" className="login body activate">
            <div id="pop-up" className="login">
                <form>
                    <fieldset className="login grupo">
                        <LoginCampo funcao='login' mensagem='Acesso' type="email" icon={<FiMail/>}/>
                        <LoginCampo funcao='senha' mensagem='*******' type="password" icon={<FiLock/>}/>
                        <a href="#" className="login">
                            <p className="login forgot">Esqueceu a senha?</p>
                        </a>
                    </fieldset> 
                </form>
                <div className="login inline">
                    <Link to={"/login/criar"} className="login">
                        <button type="submit" className='login botao logUp'>
                            Criar conta
                        </button>
                    </Link>
                    <a href="#" className="login">
                        <button type='submit' className='login botao logIn'>
                            Acessar
                        </button>       
                    </a>
                </div>
                <OtherLogins/>
            </div>
        </div>
    )
}