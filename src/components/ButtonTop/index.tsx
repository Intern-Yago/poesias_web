import React, {useState} from 'react';
import {FaArrowCircleUp} from 'react-icons/fa';

import './styles.css'

export const ScrollButton = () =>{
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

    window.addEventListener('scroll', toggleVisible);

    return (
        <div className='scrollButton'>
            <FaArrowCircleUp onClick={scrollToTop}
                style={{display: visible ? 'inline' : 'none'}} 
                className="home"
            />
        </div>
    );
}

