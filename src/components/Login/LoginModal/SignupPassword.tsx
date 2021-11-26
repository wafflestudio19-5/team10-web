import { useRef } from "react";

const SignupPassword = ({
  email,
  password,
  handleSignup,
  handleInput,
  handlenextSign,
  setGoSignup,
}: {
  email: string;
  password: string;
  handleSignup: any;
  handleInput: any;
  handlenextSign: any;
  setGoSignup: any;
}) => {
  const input = useRef<HTMLInputElement>(null);
  input.current?.focus();
  return (
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <div className="title">Create your SoundCloud account</div>
      <div className="prevEmail" onClick={handleSignup}>
        ◀️&nbsp;{email}
      </div>
      <label htmlFor="password">Choose a password</label>
      <input
        type="password"
        name="password"
        ref={input}
        value={password}
        onChange={handleInput}
      />
      <p>
        By signing up I accept the &nbsp;
        <a href="https://soundcloud.com/terms-of-use">Terms of Use</a>. I have
        read and understood the &nbsp;
        <a href="https://soundcloud.com/pages/privacy">Privacy Policy</a> and
        &nbsp;<a href="https://soundcloud.com/pages/cookies">Cookies Policy</a>.
      </p>
      <button
        onClick={() => {
          handlenextSign();
          setGoSignup(null);
        }}
      >
        Accept &amp; continue
      </button>
      <div className="signupDetails">Are you trying to sign in?</div>
      <div className="signupDetails">
        The email address that you entered was not found.
      </div>
      <div className="signupDetails">Double-check your email address.</div>
    </div>
  );
};

export default SignupPassword;
