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
    if (onSearch) onSearch(input);
  };

  const handleCancel = () => {
    cancelSearch();
    if (onSearch) onSearch("");
  };

  return (
    <S.SearchInputWrapper>
      <S.SearchInput 
        value={input}
        onChange={onChange}
        placeholder='제목을 영어로 입력하세요.'
      />

      <S.IconContainer>
        {input && (
          <S.IconButton onClick={handleCancel}>
            <S.CancelIcon src={SearchCancelIcon} />
          </S.IconButton>
        )}
        <S.IconButton onClick={handleSearch}>
          <S.Icon src={SearchIcon} />
        </S.IconButton>
      </S.IconContainer>
    </S.SearchInputWrapper>
  )
}


export default Search;
