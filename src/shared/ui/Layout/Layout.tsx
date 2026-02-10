import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import * as S from './Layout.style';
import { useEffect, useState } from 'react';

const Layout = () => {
    const location = useLocation();
    const hideHeader = location.pathname.includes('/study/expense');
    const [text, setText] = useState('');
    const [isBlur, setIsBlur] = useState(false);
    const [evaluation, setEvaluation] = useState("")

    const setEvaluationByScore = (text: string) => {
        const score = Number(text);

        if (score >= 90) {
          setEvaluation(
            '우수한 성적입니다.\n학습 내용에 대한 이해도가 매우 높습니다.'
          );
        } else if (score >= 80) {
          setEvaluation(
            '양호한 성적입니다.\n핵심 개념을 잘 이해하고 있으나,\n오답 리스트를 참고하여 일부 내용을 복습하시기 바랍니다.'
          );
        } else if (score >= 70) {
          setEvaluation(
            '보통 수준의 성적입니다.\n기본 개념은 습득하였으나,\n오답 리스트를 중심으로 전반적인 복습이 필요합니다.'
          );
        } else if (score >= 50) {
          setEvaluation(
            '미흡한 성적입니다.\n오답 리스트를 확인하여 해당 내용을 재학습하시기 바랍니다.'
          );
        } else {
          setEvaluation(
            '불합격 수준입니다.\n오답 리스트를 참고하여 전체 내용을 처음부터 다시 학습하시기 바랍니다.'
          );
        }
      };
      

    useEffect(() => (
        setEvaluationByScore(text)

    ), [text])
        
    return (
        <S.container>
        {isBlur && <S.blur_overlay/>}

        {isBlur && (
            <S.top_ui>
                <S.accuracy_rate>{text}</S.accuracy_rate>
                <S.evaluation>{evaluation}</S.evaluation>
            </S.top_ui>
        )}

        {!hideHeader && <Header />}

        <S.body style={location.pathname.includes('/auth') ? { padding: '0px' } : {}}>
            <Outlet context={{ setText, setIsBlur }} />
        </S.body>
        </S.container>
    );
};

export default Layout;
