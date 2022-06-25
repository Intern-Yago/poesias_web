import './styles.css'
import Aspas from './aspas.png'

export function Card({date,mensagem,autor}){
    return(
        <article>
            <div className="home poesia">
                <img src={Aspas} alt="" className="home aspas"/>
                <img src={Aspas} alt="" className="home aspas_reverse"/>
                <p className="home date">{date}</p>
                <p className="home escrita">
                    {mensagem}
                </p>
                <p className="home autoria">- {autor}</p>
            </div>
        </article>
    )
}