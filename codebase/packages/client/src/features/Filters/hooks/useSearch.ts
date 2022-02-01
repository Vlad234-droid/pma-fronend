import { useState } from 'react';

const useSearch = (): [string, (value: string) => void] => {
  const [searchValue, setSearchValue] = useState<string>('');

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
  };

  return [searchValue, handleSearch];
};

export default useSearch;