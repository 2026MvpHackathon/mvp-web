interface IconProps {
    color: string;
}

const QuizAI = ({color}: IconProps) => {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="16" viewBox="0 0 19 16" fill="none">
            <path d="M17 5V3C17 2.46957 16.7893 1.96086 16.4142 1.58579C16.0391 1.21071 15.5304 1 15 1H3C2.46957 1 1.96086 1.21071 1.58579 1.58579C1.21071 1.96086 1 2.46957 1 3V8C1 8.53043 1.21071 9.03914 1.58579 9.41421C1.96086 9.78929 2.46957 10 3 10H7M11 15V11C11 10.4696 11.2107 9.96086 11.5858 9.58579C11.9609 9.21071 12.4696 9 13 9C13.5304 9 14.0391 9.21071 14.4142 9.58579C14.7893 9.96086 15 10.4696 15 11V15M11 13H15M18 9V15" 
            stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

export default QuizAI;