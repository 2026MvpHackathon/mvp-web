import styled, { keyframes } from 'styled-components'
import { flexColumnCenter } from '@/shared/values/_flex'
import { typography } from '@/shared/values/typography.mixin'
import { colors } from '@/shared/values/_foundation'

export const container = styled.div<{ $isExpense?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    position: relative;
    background: ${({ $isExpense }) => ($isExpense ? colors.background.Dark : 'transparent')};
`

export const body = styled.div<{ $isExpense?: boolean }>`
    width: 100%;
    flex: 1;
    min-height: 0;
    ${({ $isExpense }) => $isExpense && 'height: 100vh; min-height: 100vh;'}
    padding: 2.25rem 2.5rem;
    background: ${({ $isExpense }) => ($isExpense ? colors.background.Dark : 'transparent')};
`

// blur

export const blur_overlay = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.25);

  z-index: 100;
  pointer-events: none; /* 아래 클릭 허용 */
`

export const top_ui = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;

  ${flexColumnCenter};
  gap: 2.25rem;
  width: 100%; // 너비를 100%로 변경
`

export const accuracy_rate = styled.p`
    ${typography("heading","xxl","bold")};
    color: ${colors.text.strong};
    margin: 0px;
    text-align: center;
`

export const evaluation = styled.p`
    ${typography("heading","lg","semibold")};
    color: ${colors.text.normal};
    margin: 0px;
    text-align: center;

    white-space: pre;
`

// 로딩바 스타일 추가
const loadingAnimation = keyframes`
  0% { width: 0%; }
  100% { width: 100%; } // 0%에서 100%로 한 번만 채워지도록 변경
`;

export const LoadingBarWrapper = styled.div`
  width: 100%;
  max-width: 20rem; // 로딩바 최대 너비
  height: 0.25rem; // 로딩바 높이
  background-color: ${colors.main.assistive}; // 로딩바 배경색
  border-radius: 0.125rem;
  overflow: hidden;
`;

export const LoadingBarFill = styled.div`
  height: 100%;
  background-color: ${colors.main.normal}; // 로딩바 채우기 색상
  border-radius: 0.125rem;
  animation: ${loadingAnimation} 5s ease-out forwards; 
`;
