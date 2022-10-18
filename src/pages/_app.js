import '../styles/globals.css'
import Layout from '../components/Layout'
import {SessionProvider} from 'next-auth/react'

function MyApp({ 
  Component, 
  pageProps:{
    session, ...pageProps
  } }) {
  return (
    <Layout>
        <SessionProvider session={session}>
          <Component {...pageProps} />
      </SessionProvider>
    </Layout>
  )
}

export default MyApp