import Recent from "@/widgets/home/recent_item/ui/Recent";
import ObjectItem from "@/widgets/home/object_item/Object";
import Search from "@/widgets/home/search-bar/SearchBar";
import { useState } from "react";

const HomePage = () => {
  const [keyword, setKeyword] = useState("");

  return (
    <>
      <Recent />
      <Search onSearch={setKeyword} />
      <ObjectItem keyword={keyword} />
    </>
  );
};

export default HomePage;
