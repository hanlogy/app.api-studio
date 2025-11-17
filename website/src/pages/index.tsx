import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';
const DownloadBadge =
  require('@site/static/img/app-store-badge-en_us.svg').default;

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.tagline}
        </Heading>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/quickstart"
          >
            Docs
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="API Studio is an open-source API workspace for developers. It runs entirely locally, keeping your data private while offering a simple, flexible interface for testing and managing APIs."
    >
      <HomepageHeader />
      <main>
        <p className={styles.description}>
          Api Studio is an open-source, privacy-first API toolkit built for
          developers who want control and simplicity. It runs fully on your
          device, with no data collection and no external connections.
        </p>
        <div>
          <Link href="https://apps.apple.com/app/api-studio/id6755138437">
            <DownloadBadge className={styles.downloadBadge} role="img" />
          </Link>
        </div>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
