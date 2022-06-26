import './styles.css'
import Aspas from '../../img/aspas.png'
import { CardProps } from '../../interfaces/CardProps';
import { Link } from 'react-router-dom';

export function Card(props: CardProps){
    return(
        <article>
                <Link to={`/poesias/${props.slug}`} className="card_link">
                <div className="home poesia">
                    <img src={Aspas} alt="" className="home aspas"/>
                    <img src={Aspas} alt="" className="home aspas_reverse"/>
                    <p className="home date">{props.date.split('-').reverse().join('-')}</p>
                    <p className="home escrita">
                        {props.poesia}
                    </p>
                    <p className="home autoria">- {props.poeta}</p>
                </div>
            </Link>
        </article>
    )
}