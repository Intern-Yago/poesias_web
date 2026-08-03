import { useEffect, useState } from 'react';
import {FaArrowCircleUp} from 'react-icons/fa';

import styles from '../styles/ScrollButton.module.css'

export default function ScrollButton(){
    const [visible, setVisible] = useState(false)

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 50){
        setVisible(true)
        }
        else if (scrolled <= 50){
        setVisible(false)
        }
    };

    const scrollToTop = () =>{
        window.scrollTo({
        top: 0,
        behavior: 'smooth'
        /* you can also use 'auto' behaviour
            in place of 'smooth' */
        });
    };
    useEffect(()=>{
        window.addEventListener('scroll', toggleVisible);
    },[])

    return (
        <FaArrowCircleUp onClick={scrollToTop}
        style={{display: visible ? 'inline' : 'none'}} className={styles.Button}/>
    );
}