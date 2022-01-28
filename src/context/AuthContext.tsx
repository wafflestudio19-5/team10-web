import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface IUserSecret {
  jwt: string | undefined | null;
  permalink: string | undefined | null;
  id: number | null | string;
}

interface IUserInfo {
  profile_img: string | undefined | null;
  display_name: string | undefined | null;
  permalink: string | undefined | null;
}

interface IAuthContext {
  userSecret: IUserSecret;
  setUserSecret: React.Dispatch<React.SetStateAction<IUserSecret>>;
  userInfo: IUserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
}

const AuthContext = createContext<IAuthContext>({
  userSecret: { jwt: undefined, permalink: undefined, id: 0 },
  setUserSecret: () => {},
  userInfo: {
    profile_img: undefined,
    display_name: undefined,
    permalink: undefined,
  },
  setUserInfo: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userSecret, setUserSecret] = useState<IUserSecret>({
    jwt: undefined,
    permalink: undefined,
    id: 0,
  });

  const [userInfo, setUserInfo] = useState<IUserInfo>({
    profile_img: undefined,
    display_name: undefined,
    permalink: undefined,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt_token");
    const storedPermalink = localStorage.getItem("permalink");
    const storedId = localStorage.getItem("id");
    if (storedToken && storedPermalink && storedId) {
      setUserSecret({
        id: parseInt(storedId),
        jwt: storedToken,
        permalink: storedPermalink,
      });
      const getMe = async () => {
        const config: any = {
          method: "get",
          url: `/users/me`,
          headers: {
            Authorization: `JWT ${storedToken}`,
          },
        };
        try {
          const res = await axios(config);
          setUserInfo({
            profile_img: res.data.image_profile,
            display_name: res.data.display_name,
            permalink: res.data.permalink,
          });
        } catch (error) {
          toast("로그인이 필요합니다.");
        }
      };
      getMe();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ userSecret, setUserSecret, userInfo, setUserInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
