import axios from "axios";
import { useRef, useState } from "react";

const SignupAge = ({
  age,
  handleInput,
  gender,
  setNextSign,
  displayName,
  inputs,
}: {
  age: undefined | number;
  handleInput: any;
  gender: undefined | string;
  setNextSign: any;
  displayName: string;
  inputs: any;
}) => {
  const input = useRef<HTMLInputElement>(null);
  input.current?.focus();
  const [lastPage, setLastSign] = useState(false);
  const onClick = async () => {
    await axios.post(`http://3.36.52.154//signup`, {
      display_name: displayName,
      email: inputs.email,
      password: inputs.password,
      age: age,
      gender: gender,
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
          <label htmlFor="gender">Tell us your age</label>
          <select name="gender" onChange={handleInput} value={gender}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <button
            onClick={() => {
              setNextSign(null);
              setLastSign(!lastPage);
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
            ref={input}
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
