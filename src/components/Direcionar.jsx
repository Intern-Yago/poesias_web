import Image from "next/image";
import Link from "next/link";

export default function Direcionar({ to, text, width = 60, height = 60 }) {
    // Keep size compact and refined (max 60px)
    const compactSize = Math.min(Number(width) || 55, 55);

    return (
        <Link href={to}>
            <a style={{ display: 'inline-block', borderRadius: '50%', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', transition: 'transform 0.2s ease' }} title={text}>
                <Image 
                    src="/img/pexelsBG.png" 
                    alt={text || "Navegar"} 
                    width={compactSize} 
                    height={compactSize}
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
            </a>
        </Link>
    )
}