import React, { useState } from "react";
import "./LoginModal.scss";
import SignIn from "./SignIn";
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
  const [goSignup, setGoSignup]: any[] = useState(false);
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
  const handleSignIn = () => {
    setGoSignup("signIn");
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
          handleSignIn={handleSignIn}
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
      ) : goSignup === "signIn" ? (
        <SignIn
          handleSignup={handleSignup}
          email={inputs.email}
          password={inputs.password}
          handleInput={handleInput}
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
