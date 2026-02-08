import { useState } from "react";

export const useSearch = () => {
  const [keyword, setKeyword] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const reset = () => {
    setKeyword("");
  };

  return {
    keyword,
    onChange,
    reset,
  };
};
