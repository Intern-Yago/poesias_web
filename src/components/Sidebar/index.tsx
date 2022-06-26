import './styles.css'
import gitImg from '../../img/git_white.png'

export function Sidebar(){
    return(
        <footer> 
                <address id="contato" className="home">
                    <p>Copyright &copy;</p>
                    <a href="https://github.com/Intern-Yago" className="home slub github" target="_blank">
                        <img src={gitImg} alt="logo Github" className="home logo git"/>
                        Intern-Yago
                    </a>
                </address>
        </footer>
    )
}