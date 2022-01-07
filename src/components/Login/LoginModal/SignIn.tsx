import axios from "axios";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useHistory } from "react-router";
import Cookies from "universal-cookie";
import { useAuthContext } from "../../../context/AuthContext";

const SignIn = ({
  handleSignup,
  email,
  password,
  handleInput,
}: {
  handleSignup: any;
  email: any;
  password: any;
  handleInput: any;
}) => {
  const input = useRef<HTMLInputElement>(null);
  input.current?.focus();
  const history = useHistory();
  useEffect(() => {
    input.current?.focus();
  }, []);
  const { setUserSecret } = useAuthContext();
  const cookies = new Cookies();
  return (
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <div className="prevEmail" onClick={handleSignup}>
        ◀️&nbsp;{email}
      </div>
      <form
        onClick={(e) => {
          e.preventDefault();
          axios
            .put(`/login`, {
              email: email,
              password: password,
            })
            .then(async (res) => {
              localStorage.setItem("permalink", res.data.permalink); // 민석님이 제안하신대로 로컬스토리지에 저장하도록 했습니다!
              localStorage.setItem("jwt_token", res.data.token);
              localStorage.setItem("id", res.data.id);
              cookies.set("is_logged_in", true, {
                path: "/",
                expires: new Date(Date.now() + 1000 * 3600 * 2),
              });
              setUserSecret({
                id: res.data.id,
                permalink: res.data.permalink,
                jwt: res.data.token,
              });
              history.push("/discover");
            })
            .catch(() => toast.error("비밀번호가 올바르지 않습니다"));
        }}
      >
        <input
          type="password"
          name="password"
          ref={input}
          value={password}
          minLength={8}
          onChange={handleInput}
          placeholder="Your Password"
          onClick={(e) => e.stopPropagation()}
        />

        <button>Sign in</button>
      </form>
    </div>
  );
};

export default SignIn;
