import * as S from './Toast.style';

interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastProps {
  messages: ToastMessage[];
  onRemove: (id: string) => void;
}

// 토스트 예시
{/* <button onClick={() => showToast('Object를 선택해 주세요', 'info')} style={{color:"#FFF"}}>
info 토스트
</button> */}

const Toast = ({ messages, onRemove }: ToastProps) => {
  return (
    <S.ToastContainer>
      {messages.map(toast => (
        <S.ToastItem key={toast.id} type={toast.type}>
          {toast.message}
          <S.CloseButton onClick={() => onRemove(toast.id)}>
            &times;
          </S.CloseButton>
        </S.ToastItem>
      ))}
    </S.ToastContainer>
  );
};

export default Toast;