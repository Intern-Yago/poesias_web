import Image from "next/image";
import Link from "next/link";

export default function Direcionar({to, text, width, height}){
    return(
        <Link href={to}>
            <a>
                <abbr title={text}>
                    <Image src="/img/pexelsBG.png" width={width} height={height}/>
                </abbr>
            </a>
        </Link>
    )
}