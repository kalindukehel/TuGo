import { getAccounts as getAccountsAPI } from "./src/api";
import React, { useState, useEffect } from "react";

const useAccounts = () => {
  const [accounts, setAccounts] = useState()
  useEffect(()=>{
    async function fetchData (){
      const response = await getAccountsAPI();
      const data = response.data;
      setAccounts(data);
      
  }
  fetchData();
},[])
return accounts;
};

export default useAccounts;
