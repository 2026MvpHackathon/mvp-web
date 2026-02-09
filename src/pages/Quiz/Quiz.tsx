import DuringQuizChoiceItem from "@/widgets/quiz/ui/DuringQuizChoiceItem";
import DuringQuizHeader from "@/widgets/quiz/ui/DuringQuizHeader";
import DuringQuizQuestion from "@/widgets/quiz/ui/DuringQuizQuestion";
import QuizBtn from "@/widgets/quiz/ui/QuizBtn";

const QuizPage = ( ) => {
    return(
       <DuringQuizQuestion 
        commentary={"해설"} 
        onfinishQuiz={true} 
        question={"Question"}
       />
    );
}

export default QuizPage;
