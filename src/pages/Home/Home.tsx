import Recent from "@/widgets/home/recent_item/ui/Recent";
import ObjectItem from "@/widgets/home/object_item/Object";
import Search from "@/widgets/home/search-bar/SearchBar";
import * as S from "./Home.Style"
import { useState } from "react";


const HomePage = () => {
  const [keyword, setKeyword] = useState("");

  return (
    <>
      <S.container>
        <S.recentContainer>
          <S.title>최근</S.title>
          <Recent />
        </S.recentContainer>

        <S.divider></S.divider>

        <S.objectContainer>
          <S.titleSearch>
            <S.title>오브젝트</S.title>
            <Search onSearch={setKeyword} />
          </S.titleSearch>

          <ObjectItem keyword={keyword} />
        </S.objectContainer>
      </S.container>

    </>
  );
};

export default HomePage;

