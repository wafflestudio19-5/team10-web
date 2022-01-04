import React, { createContext, useContext, useEffect, useState } from "react";

interface IUserSecret {
  jwt: string | undefined | null;
  permalink: string | undefined | null;
}

interface IAuthContext {
  userSecret: IUserSecret;
  setUserSecret: React.Dispatch<React.SetStateAction<IUserSecret>>;
}

const AuthContext = createContext<IAuthContext>({
  userSecret: { jwt: undefined, permalink: undefined },
  setUserSecret: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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
