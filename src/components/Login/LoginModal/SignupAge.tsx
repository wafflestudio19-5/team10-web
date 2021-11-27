import axios from "axios";
import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";

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
  const cookies = new Cookies();
  const history = useHistory();
  const input = useRef<HTMLInputElement>(null);
  input.current?.focus();
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
        cookies.set("profile_id", res.data.profile_id, {
          path: "/",
          expires: new Date(Date.now() + 3600),
        });
        cookies.set("jwt_token", res.data.token, {
          path: "/",
          expires: new Date(Date.now() + 3600),
        }); // 쿠키가 저장이 안됨. 이유를 모르겠음.
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
