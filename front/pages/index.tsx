import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Player from '../components/Player'
import React from 'react'

const Home = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Umaibou</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          うまい某Japan
        </h1>
        <Player />
      </main>

      <footer className={styles.footer}>

      </footer>
    </div>
  )
}

export default Home
