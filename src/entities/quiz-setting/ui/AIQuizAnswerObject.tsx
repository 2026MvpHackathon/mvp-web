import QuizDelete from "@/assets/icons/Quiz/QuizDelete";
import * as S from "./AIQuizAnswerObject.style";
import { colors } from "@/shared/values/_foundation";

interface AIQuizAnswerObjectProps {
  id: string;
  aiAnswer: string;
  selected: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void; // Add onDelete prop
}

const AIQuizAnswerObject = ({ id, aiAnswer, selected, onToggle, onDelete }: AIQuizAnswerObjectProps) => {
  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent onToggle from firing
    onDelete(id);
  };

  return (
    <S.Container $selected={selected} onClick={() => onToggle(id)}>
      <S.AnswerText>{aiAnswer}</S.AnswerText>
      <S.Wrapper onClick={handleDeleteClick}><QuizDelete color={colors.text.neutral}/></S.Wrapper>
    </S.Container>
  );
};

export default AIQuizAnswerObject;
