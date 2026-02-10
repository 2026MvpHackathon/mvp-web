// src/shared/ui/Toast/Toast.style.ts
import styled, { keyframes } from 'styled-components';
import { colors } from '@/shared/values/_foundation';
import { typography } from '@/shared/values/typography.mixin';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

export const ToastContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 18.75rem;
`;

export const ToastItem = styled.div<{ type?: 'success' | 'error' | 'info' }>`
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  ${typography('body', 'md', 'regular')};
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 200px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: ${slideIn} 0.3s ease-out forwards;

  &.exiting {
    animation: ${slideOut} 0.3s ease-in forwards;
  }

  background-color: ${props => {
    switch (props.type) {
      case 'success':
        return colors.state.success; // 녹색 계열
      case 'error':
        return colors.state.error;   // 빨간색 계열
      case 'info':
        return colors.text.normal;  
      default:
        return colors.text.normal;
    }
  }};
    color: ${props => {
    switch (props.type) {
      case 'success':
        return colors.text.normal; // 녹색 계열
      case 'error':
        return colors.text.normal;   // 빨간색 계열
      case 'info':
        return colors.line.normal;  
      default:
        return colors.line.normal;
    }
  }};

    ${typography("caption", "md","semibold")};

`;

export const CloseButton = styled.button<{ type?: 'success' | 'error' | 'info' }>`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 1rem;
  color: ${colors.line.normal};
`;