import { useNavigate } from "react-router-dom";

type OpenTarget =
  | { type: "recent"; id: number }
  | { type: "object"; id: number };

export const useOpenObject = () => {
  const navigate = useNavigate();

  return (target: OpenTarget) => {
    switch (target.type) {
      case "recent":
        // console.log("openObject 호출됨", target);
        navigate(`/study`);
        break;
      case "object":
        // console.log("openObject 호출됨", target);
        navigate(`/study`);
        break;
    }
  };
};