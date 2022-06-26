import './styles.css'
import Aspas from '../../img/aspas.png'
import {GiBirdMask} from 'react-icons/gi'
import { Link } from 'react-router-dom'

export function Poetry(){
    return (
        <div className="modal-container">
            <div className="modal-poesia">
                <Link to={"/"}>
                    <button className="fechar">X</button>
                </Link>
                <img src={Aspas} alt="" className="modal-aspas"/>
                <img src={Aspas} alt="" className="modal-aspas_reverse"/>
                <p className="modal-date">hello</p>
                <p className="modal-escrita">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Asperiores, excepturi error quidem ipsam voluptatem quae voluptate facere ullam et reprehenderit fugit eius laudantium minus, magni similique velit ipsa, doloremque perspiciatis.
                </p>
                <p className="modal-autoria">- salvação</p>
            </div>
        </div>
    )
}