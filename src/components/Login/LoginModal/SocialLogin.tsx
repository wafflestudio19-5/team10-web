import axios from "axios";
import { useRef } from "react";

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
  return (
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <div className="social">대충 소셜로그인</div>
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
