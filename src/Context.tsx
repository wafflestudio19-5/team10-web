import React, { createContext, useContext, useState } from "react";

const initialState: any = {
  userSecret: undefined,
  sesetUserSecrettLogin: () => null,
};

const Context = createContext(initialState);

export const AuthProvider: React.FC = ({ children }) => {
  const [userSecret, setUserSecret] = useState({
    jwt: undefined,
    permalink: undefined,
  });

  return (
    <Context.Provider value={{ userSecret, setUserSecret }}>
      {children}
    </Context.Provider>
  );
};

export const AuthContext = () => useContext(Context);
