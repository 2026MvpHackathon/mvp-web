import { useToast } from '@/shared/ui/Toast/ToastContext';

const QuizPage = () => {
  const { showToast } = useToast();

  return (
    <div>
      <div>Quiz</div>

      {/* 테스트 버튼 */}
      <button onClick={() => showToast('Object를 선택해 주세요', 'info')} style={{color:"#FFF"}}>
        info 토스트
      </button>
      <button onClick={() => showToast('저장되었습니다!', 'success')} style={{color:"#FFF"}}>
        success 토스트
      </button>
      <button onClick={() => showToast('오류가 발생했습니다.', 'error')} style={{color:"#FFF"}}>
        error 토스트
      </button>
    </div>
  );
};

export default QuizPage;