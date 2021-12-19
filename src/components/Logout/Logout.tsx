import { useHistory } from "react-router";
import styles from "./Logout.module.scss";

const Logout = () => {
  const history = useHistory();
  setTimeout(() => history.push("/"), 5000);
  return (
    <div className={styles.box}>
      <div>You've signed out. Now go mobile!</div>
      <div>5초 뒤 자동 리다이렉트 됩니다...</div>
    </div>
  );
};

export default Logout;
