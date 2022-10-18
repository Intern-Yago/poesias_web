import styles from '../styles/CampoLogin.module.css'

export default function CampoForm({funcao, icon, type, mensagem, func, value}){
    return(
        <>
            <div className={styles.campo}>
                <label htmlFor={funcao}>
                    <strong>
                        {funcao[0].toUpperCase()+funcao.substring(1)}
                    </strong>
                </label>
                <div className={styles.inline}>
                    {icon}
                    <input 
                        type={type} 
                        name={funcao} 
                        id={funcao} 
                        placeholder={mensagem} 
                        maxLength="100" 
                        className={styles.login} 
                        onChange={func} 
                        value={value}
                        autoComplete={type}
                    />
                </div>
            </div>
        </>
    )
}