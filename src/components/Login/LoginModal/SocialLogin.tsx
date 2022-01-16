import axios from "axios";
import { useRef } from "react";
import { GoogleLogin } from "react-google-login";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import { useAuthContext } from "../../../context/AuthContext";

const SocialLogin = ({
  handleInput,
  handleSignup,
  email,
  handleSignIn,
}: {
  handleInput: any;
  handleSignup: any;
  email: string;
  handleSignIn: any;
}) => {
  const { setUserSecret } = useAuthContext();
  const input = useRef<HTMLInputElement>(null);
  input.current?.focus();
  const history = useHistory();
  const cookies = new Cookies();
  const responseGoogle = (response: any) => {
    axios({
      method: "put",
      url: "/google/callback",
      data: {
        email: response.profileObj.email,
        family_name:
          response.profileObj.familyName === undefined
            ? ""
            : response.profileObj.familyName,
        given_name:
          response.profileObj.givenName === undefined
            ? ""
            : response.profileObj.givenName,
        name: response.profileObj.name,
      },
    })
      .then(async (res) => {
        localStorage.setItem("permalink", res.data.permalink); // 민석님이 제안하신대로 로컬스토리지에 저장하도록 했습니다!
        localStorage.setItem("jwt_token", res.data.token);
        localStorage.setItem("id", res.data.id);
        cookies.set("is_logged_in", true, {
          path: "/",
          expires: new Date(Date.now() + 1000 * 3600 * 12),
        });
        setUserSecret({
          id: res.data.id,
          permalink: res.data.permalink,
          jwt: res.data.token,
        });
        history.push("/discover");
      })
      .catch(() => {
        toast.error("회원가입 실패");
      });
  };
  return (
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <div className="social">
        <GoogleLogin
          clientId="576044232702-6jhp3bvsksuedov3pd4sjhdcvqntog4e.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={"single_host_origin"}
        />
      </div>
      <div className="or">——————————— &nbsp;or&nbsp; ———————————</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          axios
            .post(`/signup`, {
              email: email,
            })
            .catch((e) => {
              e.response.status === 400
                ? handleSignup()
                : e.response.status === 409
                ? handleSignIn()
                : console.log("회원가입 에러입니다");
            });
        }}
      >
        <input
          ref={input}
          type="email"
          placeholder="Your email address or profile URL"
          onChange={handleInput}
          name="email"
          value={email}
          required
        />
        <button>Continue</button>
      </form>
      <p>
        When registering, you agree that we may use your provided data for the
        registration and to send you notifications on our products and services.
        You can unsubscribe from notifications at any time in your settings. For
        additional info please refer to our&nbsp;
        <a href="https://soundcloud.com/pages/privacy">Privacy Policy</a>.
      </p>
    </div>
  );
};

export default SocialLogin;
