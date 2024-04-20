import React, { useState } from "react";

export const Context = React.createContext<IContext>({} as IContext);

interface IContext {
  updateUserData: any;
  setUpdateUserData(value: any): any;
}

const Provider = ({ children }: React.PropsWithChildren) => {
  const [updateUserData, setUpdateUserData] = useState();
  return (
    <Context.Provider value={{ updateUserData, setUpdateUserData }}>
      {children}
    </Context.Provider>
  );
};

export default Provider;
