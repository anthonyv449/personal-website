import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";

const Auth = () => {
  const { instance, accounts } = useMsal();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (accounts.length > 0) {
      setUser(accounts[0]);
    }
  }, [accounts]);

  const signIn = async () => {
    try {
      await instance.loginPopup();
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    instance.logoutPopup();
  };

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.name}</p>
          <button onClick={signOut}>Logout</button>
        </>
      ) : (
        <button onClick={signIn}>Sign in with Google</button>
      )}
    </div>
  );
};

export default Auth;
