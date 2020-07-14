import { getAccounts as getAccountsAPI } from "./src/api";
import React, { useState, useEffect } from "react";

const useAccounts = () => {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const getAccounts = async () => {
    setLoading(true);
    const response = await getAccountsAPI();
    setAccounts(response.data);
    console.log(response.data);
    setLoading(false);
  };
  getAccounts();
  console.log(accounts);
  return { loading, accounts };
};

export default useAccounts;
