import React, { Dispatch, SetStateAction, useState } from "react";
import { PricingPage } from "../types/type";


const useDebouncedSearch = (
  inititalValue: string,
  searchFunction: (value: string) => Promise<PricingPage>
): Dispatch<SetStateAction<string>> => {
  const [searchValue, setSearchValue] = React.useState(inititalValue || "");
  React.useEffect(() => {
    if(searchValue.trim() === ''){
        return
    }
    const getData = setTimeout(() => {
        searchFunction(searchValue)
    }, 2000);

    return () => clearTimeout(getData);
  }, [searchFunction, searchValue]);
  
  return setSearchValue;
};

export default useDebouncedSearch;
