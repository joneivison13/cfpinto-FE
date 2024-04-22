import React, { useEffect } from "react";
import Cache from "../services/cache";

// import { Container } from './styles';

const useAuth = () => {
  useEffect(() => {
    const token = Cache.get("assignature");
    console.log({ token });
    if (!token) {
      window.location.href = "/";
    }
  }, []);
};

export default useAuth;
