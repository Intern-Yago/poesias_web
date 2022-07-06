export function LoginCampo(props){
    return(
        <>
            <div className="login campo">
                <label htmlFor={props.funcao}>
                    <strong>
                        {props.funcao}
                    </strong>
                </label>
                <div className="login inline">
                    {props.icon}
                    <input type={props.type} name={props.funcao} id={props.funcao} placeholder={props.mensagem} maxLength="100" className="login"/>
                </div>
            </div>
        </>
    )
}