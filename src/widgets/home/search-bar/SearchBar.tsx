import * as S from './SearchBar.Style';
import SearchIcon from '@/assets/searchIcon.png';
import SearchCancelIcon from '@/assets/searchCancel.png';
import { useSearch } from "@/widgets/home/search-bar/model/useSearch";

interface SearchProps {
  onSearch?: (value: string) => void;
}

const Search = ({ onSearch }: SearchProps) => {
  const { input, onChange, cancelSearch } = useSearch();

  const handleSearch = () => {
    onSearch?.(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCancel = () => {
    cancelSearch();
    onSearch?.("");
  };

  return (
    <S.SearchInputWrapper>
      <S.SearchInput
        value={input}
        onChange={onChange}
        placeholder="제목 또는 설명을 입력하세요."
        onKeyDown={handleKeyPress}
      />

      <S.IconContainer>
        {input && (
          <S.IconButton onClick={handleCancel}>
            <S.Icon src={SearchCancelIcon} />
          </S.IconButton>
        )}
        <S.IconButton onClick={handleSearch}>
          <S.Icon src={SearchIcon} />
        </S.IconButton>
      </S.IconContainer>
    </S.SearchInputWrapper>
  );
};


export default Search;
