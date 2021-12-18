import axios from "axios";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useHistory } from "react-router";
import Cookies from "universal-cookie";

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
  const cookies = new Cookies();
  const history = useHistory();
  useEffect(() => {
    input.current?.focus();
  }, []);
  return (
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <div className="prevEmail" onClick={handleSignup}>
        ◀️&nbsp;{email}
      </div>
      <form
        onClick={(e) => {
          e.preventDefault();
          axios
            .put(`https://api.soundwaffle.com/login`, {
              email: email,
              password: password,
            })
            .then(async (res) => {
              cookies.set("permalink", res.data.permalink, {
                path: "/",
                expires: new Date(Date.now() + 3600000),
              });
              cookies.set("jwt_token", res.data.token, {
                path: "/",
                expires: new Date(Date.now() + 3600000),
              }); // 쿠키가 저장이 안됨. 이유를 모르겠음.
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
