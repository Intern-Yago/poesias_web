import Head from "next/head";

export default function Layout({children}){
    return(
        <>
            <Head>
                <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
                <title>Poesias</title>
            </Head>
            <div className="div-geral">
                {children}
            </div>
        </>
    )
}