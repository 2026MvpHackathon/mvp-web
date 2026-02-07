import AuthCheckBox from '@/widgets/AuthLayout/ui/AuthCheckBox';
import * as S from './VerifyStep.style';
import AuthBtn from '@/widgets/AuthLayout/ui/AuthBtn';

const VerifyStep = () => {
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
                        <AuthBtn radius50={false} name={'완료'}/>
                    </S.verify_btn_wrapper>
                </S.verify_check_wrapper>
            </S.verify_content>
        </S.container>
    );
}

export default VerifyStep;