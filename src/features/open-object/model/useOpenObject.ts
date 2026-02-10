import { useNavigate } from "react-router-dom";

type OpenTarget =
  | { type: "recent"; id: number }
  | { type: "object"; id: number };

export const useOpenObject = () => {
  const navigate = useNavigate();

  return (target: OpenTarget) => {
    switch (target.type) {
      case "recent":
      case "object":
        navigate(`/study?materialId=${target.id}`);
        break;
    }
  };
};