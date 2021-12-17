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
      <form
        onClick={(e) => {
          e.preventDefault();
          handlenextSign();
          setGoSignup(null);
        }}
      >
        <label htmlFor="password" onClick={(e) => e.stopPropagation()}>
          Choose a password
        </label>
        <input
          type="password"
          name="password"
          ref={input}
          value={password}
          minLength={8}
          onChange={handleInput}
          onClick={(e) => e.stopPropagation()}
        />
        <p onClick={(e) => e.stopPropagation()}>
          By signing up I accept the &nbsp;
          <a href="https://soundcloud.com/terms-of-use">Terms of Use</a>. I have
          read and understood the &nbsp;
          <a href="https://soundcloud.com/pages/privacy">Privacy Policy</a> and
          &nbsp;
          <a href="https://soundcloud.com/pages/cookies">Cookies Policy</a>.
        </p>
        <button>Accept &amp; continue</button>
      </form>
      <div className="signupDetails">Are you trying to sign in?</div>
      <div className="signupDetails">
        The email address that you entered was not found.
      </div>
      <div className="signupDetails">Double-check your email address.</div>
    </div>
  );
};

export default SignupPassword;
