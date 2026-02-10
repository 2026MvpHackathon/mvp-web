import SelectObject from "@/entities/quiz-setting/ui/SelectObject";
import SelectCircle from "@/entities/quiz-setting/ui/SelectCircle";
import FavoriteCheckbox from "@/entities/quiz-setting/ui/SquareCheckboxBookmark";
import WrongAnswerCheckbox from "@/entities/quiz-setting/ui/SquareCheckboxWrongAnswer";
import ProblemDropdown from "@/entities/quiz-setting/ui/ProblemDropdown";

const QuizPage = ( ) => {
  return (
      <>
        <SelectCircle />
        <SelectObject />
        <FavoriteCheckbox />
        <WrongAnswerCheckbox />
        <ProblemDropdown />
      </>
    );
}

export default QuizPage;
