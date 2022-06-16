import {FiMail} from 'react-icons/fi'
import {GiPadlock} from 'react-icons/gi'
import './styles.css'

export function VisibleLogin(e) {
    const pop = document.getElementById("pop")
    if (pop){
    pop.classList.add("activate")
    pop.addEventListener('click',(e)=>{
        if(e.target.id == "pop" || e.target.className == 'fechar'){
            pop.classList.remove('activate')
        }
    })
}
}

export function Login(){    
    return(
        <div id="pop" className="body">
            <div id="pop-up">
                <button className="fechar" >X</button>
                <form>
                    <fieldset className="grupo">
                        <div className="campo">
                            <label htmlFor="nome"><strong>Login</strong></label>
                            <div className="inline">
                                <FiMail/>
                                <input type="email" name="nome" id="nome" placeholder="Acesso" maxLength="100"/>
                            </div>
                        </div>
                        <div className="campo">
                            <label htmlFor="sobrenome"><strong>Senha</strong></label>
                            <div className="inline">
                                <GiPadlock/>
                                <input type="password" name="sobrenome" id="sobrenome" placeholder="*******" maxLength="100"/>
                            </div>
                            <a href="#">
                                <p className="forgot">Esqueceu a senha?</p>
                            </a>
                        </div>
                    </fieldset> 
                </form>
                <div className="inline">
                    <a href="#">
                        <button type="submit" className='botao logUp'>
                            Criar conta
                        </button>
                    </a>
                    <a href="poeta.html">
                        <button type='submit' className='botao logIn'>
                            Acessar
                        </button>       
                    </a>
                </div>
                <div className='line'>
                </div>
            </div>
        </div>
    )
}