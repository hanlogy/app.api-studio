import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Self-hosted and private',
    Svg: require('@site/static/img/self-hosted.svg').default,
    description: <>All data and requests stay on your own device.</>,
  },
  {
    title: 'Config-driven workspace',
    Svg: require('@site/static/img/json.svg').default,
    description: <>Manage APIs using local JSON files for full control.</>,
  },
  {
    title: 'All-in-one API toolkit',
    Svg: require('@site/static/img/all-in-one.svg').default,
    description: (
      <>Testing, documentation management, and mock server features.</>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
