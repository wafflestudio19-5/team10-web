import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

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
  useEffect(() => {
    input.current?.focus();
  }, []);
  const alertPwError = () => toast.error("비밀번호는 8글자 이상이어야 합니다");
  const goNext = () => {
    handlenextSign();
    setGoSignup(null);
  };
  return (
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <div className="title">Create your SoundWaffle account</div>
      <div className="prevEmail" onClick={handleSignup}>
        ◀️&nbsp;{email}
      </div>
      <form
        onClick={(e) => {
          e.preventDefault();
          input.current?.value.length === undefined
            ? alertPwError()
            : input.current?.value.length < 8
            ? alertPwError()
            : goNext();
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
