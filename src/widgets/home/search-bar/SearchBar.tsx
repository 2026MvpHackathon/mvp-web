import * as S from './SearchBar.Style'
import SearchIcon from '@/assets/searchIcon.png'
import { useSearch } from "@/widgets/home/search-bar/model/useSearch";

const Search = () => {
  const { keyword, onChange, reset } = useSearch();

  return (
    <>
      <S.SearchInputWrapper>
        <S.IconWrapper onClick={reset}>
          <S.SearchIcon src={SearchIcon} />
        </S.IconWrapper>
        <S.SearchInput 
        value={keyword}
        onChange={onChange}/>
      </S.SearchInputWrapper>
    </>
  )
}

export default Search;