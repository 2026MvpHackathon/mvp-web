import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import * as S from './Layout.style';
import { useEffect, useState } from 'react';
import { ToastProvider } from '@/shared/ui/Toast/ToastContext';
import { colors } from '@/shared/values/_foundation';


interface LayoutContextType {
  setText: (v: string) => void;
  setIsBlur: (v: boolean) => void;
}


const Layout = () => {
  const location = useLocation();
  const hideHeader = location.pathname.includes('/study/expense');
  const [text, setText] = useState('');
  const [isBlur, setIsBlur] = useState(false);
  const [evaluation, setEvaluation] = useState('');

const EXPENSE_BG = colors.background.Dark;


    // expense: 흰 배경 없이 아래까지 채우기 (66ac796처럼)
    useEffect(() => {
        if (!hideHeader) return;
        const html = document.documentElement;
        const bodyEl = document.body;
        const root = document.getElementById('root');
        const prevHtml = html.style.backgroundColor;
        const prevBody = bodyEl.style.backgroundColor;
        const prevRoot = root?.style.backgroundColor ?? '';
        html.style.backgroundColor = EXPENSE_BG;
        bodyEl.style.backgroundColor = EXPENSE_BG;
        if (root) root.style.backgroundColor = EXPENSE_BG;
        return () => {
            html.style.backgroundColor = prevHtml;
            bodyEl.style.backgroundColor = prevBody;
            if (root) root.style.backgroundColor = prevRoot;
        };
    }, [hideHeader]);

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

  useEffect(() => {
    setEvaluationByScore(text);
  }, [text]);

    return (
        <ToastProvider>
            
            <S.container $isExpense={hideHeader}>
            {isBlur && <S.blur_overlay/>}

            {isBlur && (
            <S.top_ui>
                <S.accuracy_rate>{text}</S.accuracy_rate>
                <S.evaluation>{evaluation}</S.evaluation>
                <S.LoadingBarWrapper>
                <S.LoadingBarFill />
                </S.LoadingBarWrapper>
            </S.top_ui>
            )}

            {!hideHeader && <Header />}

            <S.body
            $isExpense={hideHeader}
            style={location.pathname.includes('/auth') ? { padding: '0px' } : undefined}
            >
                <Outlet context={{ setText, setIsBlur }} />
            </S.body>
        </S.container>
        </ToastProvider>
    );
};

export default Layout;