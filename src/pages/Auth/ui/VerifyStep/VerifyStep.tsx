import AuthCheckBox from '@/widgets/Auth/ui/AuthCheckBox/AuthCheckBox';
import * as S from './VerifyStep.style';
import AuthBtn from '@/widgets/Auth/ui/AuthBtn/AuthBtn';
import { useNavigate } from 'react-router-dom';

const VerifyStep = () => {
    const navigate = useNavigate();

    function Btnhandler() {
        navigate('/auth/login')
    }

    return(
        <S.container>
            <S.verify_title>개인정보 처리 방침</S.verify_title>
            <S.verify_content>
                <S.verify_explanation>
                    <S.verify_explanation_text>text</S.verify_explanation_text>
                </S.verify_explanation>
                <S.verify_check_wrapper>
                    <AuthCheckBox large={true} text={'개인정보 처리방침에 동의합니다. (필수)'}/>
                    <S.verify_btn_wrapper>
                        <AuthBtn radius50={false} name={'완료'} onClick={Btnhandler}/>
                    </S.verify_btn_wrapper>
                </S.verify_check_wrapper>
            </S.verify_content>
        </S.container>
    );
}

export default VerifyStep;