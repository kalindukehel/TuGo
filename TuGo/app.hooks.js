import { getAccounts as getAccountsAPI } from "./src/api";
import React, { useState, useEffect } from "react";

const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  useEffect(() => {
    getAccountsAPI().then((res) => {
      //console.log(res.data);
      setAccounts(res.data);
    });
  }, []);
  return accounts;
};

export default useAccounts;
