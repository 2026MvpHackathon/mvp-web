// request
export interface QuizRequest {
    quizQuestionIds: number[];
    materialId: number;
    isFavorite: boolean;
    isIncorrect: boolean;
    numberOfQuestions: number;
}  


// response
export interface QuizItem {
    quizQuestionId: string; 
    question: string;
    options: string[];
    correctAnswerIndex: number;
    aiAnswer: string;
}
  
export interface QuizResponse {
    status: number;
    message: string;
    data: QuizItem[];
}


  