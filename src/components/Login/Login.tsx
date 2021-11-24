import styles from "./Login.module.scss";

const Login = () => {
  return (
    <div className={styles.box}>
      <div className={styles.upperline}></div>
      <div className={styles.background}>
        <div>
          <button className={styles.signIn}>Sign in</button>
          <button className={styles.createAccount}>Create account</button>
        </div>
        <p className={styles.texthighlight}>Connect on SoundCloud</p>
        <p className={styles.textdetail}>
          Discover, stream, and share a constantly expanding mix of music
          <br />
          from emerging and major artists around the world.
        </p>
        <button className={styles.signUp}>Sign up for free</button>
      </div>
    </div>
  );
};

export default Login;
