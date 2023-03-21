import React, { Dispatch, SetStateAction, useState } from "react";
import { PricingPage, SearchOptions } from "../types/type";

const useDebouncedSearch = (
  inititalValue: SearchOptions,
  searchFunction: (value: SearchOptions) => Promise<PricingPage>
): {
  searchOptions: SearchOptions;
  setSearchOptions: (value: SearchOptions) => void;
} => {
  const [searchValue, setSearchValue] = React.useState<SearchOptions>(
    inititalValue || ""
  );
  const updateSearchValue = (value: SearchOptions) => {
    if (
      searchValue.productName === value.productName &&
      searchValue.price === value.price &&
      searchValue.sku === value.sku
    ) {
      return;
    }

    if (
      searchValue.productName?.trim() === "" &&
      searchValue.price?.trim() === "" &&
      searchValue.sku?.trim() === ""
    ) {
      setSearchValue({});
      return;
    }

    setSearchValue(value);
  };
  React.useEffect(() => {
    const getData = setTimeout(() => {
      searchFunction(searchValue);
    }, 2000);

    return () => clearTimeout(getData);
  }, [searchFunction, searchValue]);

  return { searchOptions: searchValue, setSearchOptions: updateSearchValue };
};

export default useDebouncedSearch;
