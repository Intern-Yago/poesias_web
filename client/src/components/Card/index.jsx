import React from "react";

import './styles.css'
import Aspas from './aspas.png'

export function Card({date,mensagem,autor}){
    return(
        <article>
            <div className="poesia">
                <img src={Aspas} alt="" className="aspas"/>
                <img src={Aspas} alt="" className="aspas_reverse"/>
                <p className="date">{date}</p>
                <p className="escrita">
                    {mensagem}
                </p>
                <p className="autoria">- {autor}</p>
            </div>
        </article>
    )
}