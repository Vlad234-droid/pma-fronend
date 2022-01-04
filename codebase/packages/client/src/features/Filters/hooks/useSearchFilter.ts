import { useState } from 'react';

const useSearchFilter = (): [string, (value: string) => void] => {
  const [searchValue, setSearchValue] = useState<string>('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  return [searchValue, handleSearch];
};

export default useSearchFilter;
