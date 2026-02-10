// request
export interface QuizRequest {
    quizQuestionIds: number[];
    materialId: number;
    isFavorite: boolean;
    isIncorrect: boolean;
    numberOfQuestions: number;
}  

export interface SubmitResultRequest {
    quizQuestionId: number;
    isCorrect: boolean;
    isFavorite: boolean;
}

export interface QuizOption {
    id: number;
    text: string;
    state: 'disabled' | 'selected' | 'correct' | 'different';
}

// response
export interface QuizItem {
    quizQuestionId: number; 
    question: string;
    options: string[]; // QuizOption[] 대신 string[]으로 되돌림
    correctAnswerIndex: number;
    aiAnswer: string;
}
  
export interface QuizResponse {
    data: any;
    status: number;
    message: string;
    quizzes: QuizItem[]; // Corrected to match API response
    metadata?: any; // Add metadata if it's consistently present
}

export interface SubmitResultResponse {
    status: number;
    message: string;
    data: {
        createdAt: string;
        updatedAt: string;
        id: number;
        favorite: boolean;
        incorrect: boolean;
    };
}
