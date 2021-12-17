import { useState } from "react";
import styles from "./Login.module.scss";
import LoginModal from "./LoginModal/LoginModal";

const Login = () => {
  const [modal, setModal] = useState(false);
  const handleModal = () => {
    setModal(!modal);
  };
  return (
    <div className={styles.box}>
      <LoginModal modal={modal} handleModal={handleModal} />
      <div className={styles.upperline}></div>
      <div className={styles.background}>
        <div>
          <button className={styles.signIn} onClick={handleModal}>
            Sign in
          </button>
          <button className={styles.createAccount}>Create account</button>
        </div>
        <p className={styles.texthighlight}>Connect on SoundCloud</p>
        <p className={styles.textdetail}>
          Discover, stream, and share a constantly expanding mix of music
          <br />
          from emerging and major artists around the world.
        </p>
        <button className={styles.signUp} onClick={handleModal}>
          Sign up for free
        </button>
      </div>
    </div>
  );
};

export default Login;
