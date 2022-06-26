import './styles.css'
import Aspas from '../../img/aspas.png'
import {GiBirdMask} from 'react-icons/gi'
import { Link } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'

const GET_PUBLISH_BY_SLUG_QUERY = gql`
    query GetPublishBySlug($slug: String) {
        publish(where: {slug: $slug}) {
            poesia
            poeta
            date
        }
    }
`

interface GetPublishBySlugResponse{
    publish:{
        poesia:string;
        poeta:string;
        date:Date;
    }
}

interface PoetryProps{
    publishSlug:string;
}

export function Poetry(props:PoetryProps){
    const {data} = useQuery<GetPublishBySlugResponse>(GET_PUBLISH_BY_SLUG_QUERY, {
        variables:{
            slug: props.publishSlug
        }
    })

    return (
        <div className="modal-container">
            <div className="modal-poesia">
                <Link to={"/"}>
                    <button className="fechar">X</button>
                </Link>
                <img src={Aspas} alt="" className="modal-aspas"/>
                <img src={Aspas} alt="" className="modal-aspas_reverse"/>
                <p className="modal-date">{data?.publish.date}</p>
                <p className="modal-escrita">
                    {data?.publish.poesia}
                </p>
                <p className="modal-autoria">- {data?.publish.poeta}</p>
            </div>
        </div>
    )
}