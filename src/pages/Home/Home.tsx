// HomePage.tsx
import Recent from "@/widgets/home/recent_item/ui/Recent";
import ObjectItem from "@/widgets/home/object_item/Object";
import Search from "@/widgets/home/search-bar/SearchBar";
import { useState } from "react";

const HomePage = () => {
  const [keyword, setKeyword] = useState("");

  return (
    <>
      <Recent />
      {/* SearchBar에 검색 완료 시 setKeyword 호출 */}
      <Search onSearch={setKeyword} />
      <ObjectItem keyword={keyword} />
    </>
  );
};

export default HomePage;
