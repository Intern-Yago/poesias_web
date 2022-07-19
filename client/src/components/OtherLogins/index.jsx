import React from "react";
import {AiOutlineGoogle, AiOutlineGithub} from 'react-icons/ai'

import styles from './styles.module.css'

export function OtherLogins(){
    return(
        <>
            <div className={styles.line}>
            </div>
            <div className={styles.other}>
                <AiOutlineGithub className={styles.logInOther}/>
                <AiOutlineGoogle className={styles.logInOther}/>
            </div>
        </>
    )
}