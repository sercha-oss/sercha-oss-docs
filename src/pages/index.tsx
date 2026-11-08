import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const SECTIONS = [
  {
    title: 'SerchaQL',
    to: '/serchaql/intro',
    desc: 'The query language: what you can read, every clause and function, and the statements admins use to define the model.',
  },
  {
    title: 'API',
    to: '/api/sercha-api',
    desc: 'Get a token, run a query, call a saved tool, push documents and export results.',
  },
];

export default function Home(): React.JSX.Element {
  return (
    <Layout title="Docs" description="SerchaQL and the Sercha API.">
      <main className={styles.main}>
        <h1 className={styles.title}>Sercha docs</h1>
        <p className={styles.lede}>Query your organisation's data with SerchaQL, and build on it with the API.</p>
        <div className={styles.grid}>
          {SECTIONS.map((s) => (
            <Link key={s.title} to={s.to} className={styles.card}>
              <h2>{s.title}</h2>
              <p>{s.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}
