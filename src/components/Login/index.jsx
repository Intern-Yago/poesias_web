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
                            <input type="email" name="nome" id="nome" placeholder="Acesso" maxLength="100"/>
                        </div>
                        <div className="campo">
                            <label htmlFor="sobrenome"><strong>Senha</strong></label>
                            <input type="password" name="sobrenome" id="sobrenome" placeholder="*******" maxLength="100"/>
                        </div>
                    </fieldset> 
                </form>
                <div id="button">
                    <a href="poeta.html">
                        <input type="submit" value="Acessar" className="botao"/>         
                    </a>
                </div>
            </div>
        </div>
    )
}