import axios from "axios";
import { useRef } from "react";
import { GoogleLogin } from "react-google-login";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";

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
  const input = useRef<HTMLInputElement>(null);
  input.current?.focus();
  const history = useHistory();
  const responseGoogle = (response: any) => {
    axios({
      method: "post",
      url: "/signup",
      data: { email: response.profileObj.email },
    }).catch((e) => {
      e.response.status === 400
        ? axios({
            method: "post",
            url: "/signup",
            data: {
              display_name: response.profileObj.name,
              email: response.profileObj.email,
              password: response.googleId,
              gender: "yet",
              age: 20,
            },
          })
            .then(async (res) => {
              localStorage.setItem("permalink", res.data.permalink);
              localStorage.setItem("jwt_token", res.data.token);
              history.push("/discover");
            })
            .catch(() => {
              toast.error("회원가입 실패");
            })
        : e.response.status === 409
        ? toast.error("지금은 소셜로그인이 안됩니다 500 error")
        : console.log("회원가입 에러입니다");
    });
    // axios({
    //   method: "get",
    //   url: "/google/callback",
    //   data: {
    //     email: profile.email,
    //     family_name: profile.familyName === undefined ? "" : profile.familyName,
    //     given_name: profile.givenName === undefined ? "" : profile.givenName,
    //     name: profile.name,
    //   },
    // })
    //   .then((r) => console.log(r))
    //   .catch((e) => console.dir(e));
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
