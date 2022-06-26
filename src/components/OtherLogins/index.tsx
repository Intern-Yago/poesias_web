import {AiOutlineGoogle, AiOutlineGithub} from 'react-icons/ai'

export function OtherLogins(){
    return(
        <>
            <div className='login line'>
            </div>
            <div className="login other">
                <AiOutlineGithub className='login logInOther'/>
                <AiOutlineGoogle className='login logInOther'/>
            </div>
        </>
    )
}