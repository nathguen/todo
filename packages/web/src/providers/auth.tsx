import { User } from "@common/types/users.interface";
import React, { createContext, useContext, useState } from "react";
import { fetchUserByID } from "../integrations";

interface AuthContextValue {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  getUser: () => Promise<User | null>;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: () => {},
  getUser: async () => null,
  isLoading: false,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    // perform login logic here, e.g. make API request to authenticate user
    // const authenticatedUser: User = await authenticateUser(email, password);
    // setUser(authenticatedUser);
  };

  const logout = () => {
    // perform logout logic here, e.g. clear user data from local storage
    // setUser(null);
  };

  const getUser = async () => {
    // @TODO replace with authenticated user
    const user = await fetchUserByID(1);
    setUser(user);

    return user;
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, getUser, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
