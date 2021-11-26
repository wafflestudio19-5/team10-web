import { useRef } from "react";

const SocialLogin = ({
  handleInput,
  handleSignup,
  email,
}: {
  handleInput: any;
  handleSignup: any;
  email: string;
}) => {
  const input = useRef<HTMLInputElement>(null);
  input.current?.focus();
  return (
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <div className="social">대충 소셜로그인</div>
      <div className="or">——————————— &nbsp;or&nbsp; ———————————</div>
      <input
        ref={input}
        type="email"
        placeholder="Your email addressor profile URL"
        onChange={handleInput}
        name="email"
        value={email}
        required
      />
      <button onClick={() => handleSignup()}>Continue</button>
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
