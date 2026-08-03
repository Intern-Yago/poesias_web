import Image from 'next/image'
import styles from '../styles/Card.module.css'

export default function Card({ date, mensagem, autor }) {
    const autorSeguro = autor && typeof autor === 'string' && autor.length > 0
        ? autor[0].toUpperCase() + autor.substring(1)
        : 'Anônimo'

    const textoSeguro = mensagem && typeof mensagem === 'string' && mensagem.length > 0
        ? mensagem[0].toUpperCase() + mensagem.substring(1)
        : ''

    var dateFormatado = ''
    try {
        if (date && typeof date === 'string') {
            dateFormatado = date.substr(0, 10).split("-").reverse().join("/")
        }
    } catch (e) {
        dateFormatado = ''
    }

    return (
        <article>
            <div className={styles.poesia}>
                <Image src='/img/aspas.png' alt="aspas" width="32" height='32' />
                <Image src='/img/aspas.png' alt="aspas" width='32' height='32' className={styles.aspas_reverse} />
                <p className={styles.date}>{dateFormatado}</p>
                <p className="escrita">
                    {textoSeguro}
                </p>
                <p className={styles.autoria}>- {autorSeguro}</p>
            </div>
        </article>
    )
}