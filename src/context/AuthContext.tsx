import React, { createContext, useContext, useEffect, useState } from "react";

interface IUserSecret {
  jwt: string | undefined | null;
  permalink: string | undefined | null;
}

const initialState: any = {
  userSecret: undefined,
  sesetUserSecrettLogin: () => null,
};

const AuthContext = createContext(initialState);

export const AuthProvider: React.FC = ({ children }) => {
  const [userSecret, setUserSecret] = useState<IUserSecret>({
    jwt: undefined,
    permalink: undefined,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt_token");
    const storedPermalink = localStorage.getItem("permalink");
    if (storedToken && storedPermalink) {
      setUserSecret({
        jwt: storedToken,
        permalink: storedPermalink,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userSecret, setUserSecret }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
