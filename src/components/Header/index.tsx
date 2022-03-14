import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.headerContainer}>
      <a className={styles.headerContent} href="/">
        <img src="/images/logo.svg" alt="logo" />
      </a>
    </header>
  );
}
