import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import styles from "./Login.module.scss";
import LoginModal from "./LoginModal/LoginModal";

const Login = () => {
  const [modal, setModal] = useState(false);
  const handleModal = () => {
    setModal(!modal);
  };
  const history = useHistory();
  const cookie = new Cookies();

  useEffect(() => {
    if (cookie.get("is_logged_in")) {
      history.push("/discover");
    }
  }, []);

  return (
    <div className={styles.box}>
      <LoginModal modal={modal} handleModal={handleModal} />
      <div className={styles.upperline}></div>
      <div className={styles.background}>
        <div>
          <button className={styles.signIn} onClick={handleModal}>
            Sign in
          </button>
          <button className={styles.createAccount} onClick={handleModal}>
            Create account
          </button>
        </div>
        <p className={styles.texthighlight}>Connect on SoundWaffle</p>
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
