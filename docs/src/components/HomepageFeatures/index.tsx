import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/undraw_codeherence_mountain.svg').default,
    description: (
      <>
        Designed from the ground up to be easily installed and used in your React Native projects.
      </>
    ),
  },
  {
    title: 'Extensible',
    Svg: require('@site/static/img/consulting.svg').default,
    description: (
      <>
        Built with extensibility in mind. You can easily create your own header components and use
        them with React Native Header.
      </>
    ),
  },
  {
    title: 'Powered by Reanimated',
    Svg: require('@site/static/img/feature-dev.svg').default,
    description: <>Built with Reanimated to achieve native animation performance.</>,
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md margin-vert--lg">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
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
