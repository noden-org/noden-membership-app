'use client';

import Image from 'next/image';
import styles from './page.module.css';

import MembershipChecker from './MembershipChecker';

export default function Home() {
  return (
    <>
      <header className={styles.header}>
        <Image
          className={styles.logo}
          src="/img/noden-favicon-128.png"
          alt="Noden Logo"
          width={50}
          height={50}
          style={{ marginBottom: '1rem' }}
        />
        <h1 className={styles.mainHeading}>
          Noden | <b>Membership</b>
        </h1>
      </header>

      <main className={styles.main}>
        <MembershipChecker />
      </main>
    </>
  );
}
