import Image from 'next/image'
import styles from '../styles/Card.module.css'

export default function Card({date,mensagem,autor}){
    const autorFormatado = autor[0].toUpperCase()+autor.substring(1)
    const textoFormatado = mensagem[0].toUpperCase()+mensagem.substring(1)
    var dateFormatado = date.substr(0, 10).split("-").reverse().join("/")
    
    
    return(
        <article>
            <div className={styles.poesia}>
                <Image src='/img/aspas.png' width="32" height='32'/>
                <Image src='/img/aspas.png' width='32' height='32' className={styles.aspas_reverse}/>
                <p className={styles.date}>{dateFormatado}</p>
                <p className="escrita">
                    {textoFormatado}
                </p>
                <p className={styles.autoria}>- {autorFormatado}</p>
            </div>
        </article>
    )
}