import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import Config from '../../Config';
import HmImage from '../../shared/components/Image';
import HmLazyComponent from '../../shared/components/LazyComponent';
import RootState from '../../shared/types/RootState.type';
import MeAction from '../actions/Me.action';
import hatPNG from '../images/hat.png';
import hatWebP from '../images/hat.webp';
import magicPNG from '../images/magic.png';
import magicWebP from '../images/magic.webp';
import styles from './Home.module.css';

const connector = connect(
  (state: RootState) => ({
    me: state.me,
  }),
  {
    fetchMe: MeAction.fetchMe,
  }
);

type Props = ConnectedProps<typeof connector>;

const Home: React.FC<Props> = (props) => {
  const { me, fetchMe } = props;

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const { name, slogan } = me;

  return (
    <div className={styles.hmHome}>
      <div className={`container ${styles.hmContainer}`}>
        <h1 className={styles.hmTitle}>{name}</h1>
        <a className={styles.hmContent} href={Config.githubURL} target="_blank" rel="noopener noreferrer">
          <HmLazyComponent>
            <HmImage className={styles.hmEmoji} alt="Magical Hat" src={hatPNG} webpSrc={hatWebP} />
          </HmLazyComponent>
          <div className={styles.hmText}>{slogan}</div>
          <HmLazyComponent>
            <HmImage className={styles.hmEmoji} alt="Magic" src={magicPNG} webpSrc={magicWebP} />
          </HmLazyComponent>
        </a>
      </div>
    </div>
  );
};

export default connector(Home);
