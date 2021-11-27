import React, { useState } from "react";
import "./LoginModal.scss";
import SignupAge from "./SignupAge";
import SignupPassword from "./SignupPassword";
import SocialLogin from "./SocialLogin";

const LoginModal = ({
  modal,
  handleModal,
}: {
  modal: boolean;
  handleModal: any;
}) => {
  const [goSignup, setGoSignup] = useState(false);
  const [nextSign, setNextSign] = useState(false);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    age: "",
    gender: "male",
    displayName: "",
  });
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  const handleSignup = () => {
    setGoSignup(!goSignup);
  };
  const handlenextSign = () => {
    setNextSign(!nextSign);
  };
  return (
    <div
      className={`${modal === true ? "wrapper" : "wrapper hidden"}`}
      onClick={handleModal}
    >
      {goSignup === false ? (
        <SocialLogin
          handleInput={handleInput}
          handleSignup={handleSignup}
          email={inputs.email}
        />
      ) : goSignup === true ? (
        <SignupPassword
          email={inputs.email}
          password={inputs.password}
          handleSignup={handleSignup}
          handleInput={handleInput}
          handlenextSign={handlenextSign}
          setGoSignup={setGoSignup}
        />
      ) : (
        <SignupAge
          age={inputs.age}
          handleInput={handleInput}
          gender={inputs.gender}
          setNextSign={setNextSign}
          displayName={inputs.displayName}
          inputs={inputs}
        />
      )}
    </div>
  );
};

export default LoginModal;
