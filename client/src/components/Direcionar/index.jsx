import React from 'react'
import { Link } from 'react-router-dom'
import luaImg from '../../img/pexelsBG.png'

export function Direcionar({to, text}){
    return(
        <Link to={to}>
                <abbr title={text}>
                    <img src={luaImg}/>
                </abbr>
        </Link>
    )
}