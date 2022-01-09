import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

const SignupAge = ({
  age,
  handleInput,
  gender,
  setNextSign,
  displayName,
  inputs,
}: {
  age: string;
  handleInput: any;
  gender: undefined | string;
  setNextSign: any;
  displayName: string;
  inputs: any;
}) => {
  const history = useHistory();
  const input = useRef<HTMLInputElement>(null);
  const input2 = useRef<HTMLInputElement>(null);
  useEffect(() => {
    input.current?.focus();
  }, []);
  const [lastPage, setLastSign] = useState(false);
  const onClick = async () => {
    await axios
      .post(`https://api.soundwaffle.com/signup`, {
        display_name: displayName,
        email: inputs.email,
        password: inputs.password,
        age: parseInt(age),
        gender: gender,
      })
      .then(async (res) => {
        localStorage.setItem("permalink", res.data.permalink);
        localStorage.setItem("jwt_token", res.data.token);
        history.push("/discover");
      })
      .catch(() => {
        console.log("회원가입 실패");
      });
  };
  return (
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      {lastPage === false ? (
        <>
          <div className="title">Create your SoundCloud account</div>
          <label htmlFor="number">Tell us your age</label>
          <input
            type="number"
            name="age"
            ref={input}
            value={age}
            onChange={handleInput}
          />
          <label htmlFor="gender">Gender</label>
          <select name="gender" onChange={handleInput} value={gender}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <button
            onClick={() => {
              setNextSign(null);
              setLastSign(!lastPage);
              input2.current?.focus();
            }}
          >
            Continue
          </button>
        </>
      ) : (
        <>
          <div className="title">Tell us a bit about yourself</div>
          <label htmlFor="displayName">Choose your display name</label>
          <input
            type="text"
            name="displayName"
            ref={input2}
            value={displayName}
            onChange={handleInput}
          />
          <p>
            Your display name can be anything you like. Your name or artist name
            are good choices.
          </p>
          <button onClick={onClick}>Get started</button>
        </>
      )}
    </div>
  );
};
export default SignupAge;
