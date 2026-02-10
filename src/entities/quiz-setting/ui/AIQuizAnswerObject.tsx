import * as S from "./AIQuizAnswerObject.style";

interface AIQuizAnswerObjectProps {
  id: string;
  answerText: string;
  selected: boolean;
  onToggle: (id: string) => void;
}

const AIQuizAnswerObject = ({ id, answerText, selected, onToggle }: AIQuizAnswerObjectProps) => {
  return (
    <S.Container $selected={selected} onClick={() => onToggle(id)}>
      <S.AnswerText>{answerText}</S.AnswerText>
    </S.Container>
  );
};

export default AIQuizAnswerObject;
