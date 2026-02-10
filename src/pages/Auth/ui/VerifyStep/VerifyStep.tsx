import AuthCheckBox from '@/widgets/Auth/ui/AuthCheckBox/AuthCheckBox';
import * as S from './VerifyStep.style';
import AuthBtn from '@/widgets/Auth/ui/AuthBtn/AuthBtn';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const VerifyStep = () => {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState(false);

    function Btnhandler() {
        if (isActive) {
            navigate('/auth/login');
        } else {
            console.warn("checkBox 비활성화"); // Changed to warn, as it might be an intentional UI state
        }
    }

    const TEXT = "본 서비스는 「개인정보 보호법」에 따라 이용자의 개인정보를 보호하고, 관련한 고충을 원활히 처리하기 위하여 다음과 같은 개인정보 처리방침을 수립·공개합니다.\n\n1. 수집하는 개인정보 항목\n본 서비스는 회원가입 및 로그인을 위해 아래의 개인정보만을 수집합니다.\n* 이메일 주소\n* 비밀번호\n※ 비밀번호는 단방향 암호화 방식으로 저장되며, 원문 형태로 저장되지 않습니다.\n\n2. 개인정보의 수집 및 이용 목적\n수집한 개인정보는 다음의 목적에 한하여 이용됩니다.\n* 회원 식별\n* 로그인 및 사용자 인증\n* 서비스 제공 및 운영\n\n3. 개인정보의 보유 및 이용 기간\n* 이용자의 개인정보는 회원 탈퇴 시 즉시 삭제됩니다.\n* 단, 관련 법령에 따라 보관이 필요한 경우 해당 법령에서 정한 기간 동안 보관할 수 있습니다.\n\n4. 개인정보의 보호 조치\n본 서비스는 개인정보 보호를 위해 다음과 같은 조치를 취하고 있습니다.\n* 비밀번호 단방향 암호화 저장\n* 개인정보 접근 권한의 최소화\n* 외부로부터의 무단 접근 방지\n\n5. 이용자의 권리\n이용자는 언제든지 본인의 개인정보에 대해 다음과 같은 권리를 행사할 수 있습니다.\n* 개인정보 열람\n* 개인정보 수정\n* 개인정보 삭제 요청(회원 탈퇴)\n\n6. 개인정보 관련 문의\n개인정보 처리와 관련한 문의는 아래의 연락처로 문의하실 수 있습니다.\n\n7. 개인정보 처리방침의 변경\n본 개인정보 처리방침은 서비스 내용의 변경 또는 관련 법령의 개정에 따라 변경될 수 있으며, 변경 시 서비스 내 공지를 통해 안내합니다."

    return(
        <S.container>
            <S.verify_title>개인정보 처리 방침</S.verify_title>
            <S.verify_content>
                <S.verify_explanation>
                    <S.verify_explanation_text>{TEXT}</S.verify_explanation_text>
                </S.verify_explanation>
                <S.verify_check_wrapper>
                    <AuthCheckBox 
                        large={true} 
                        text={'개인정보 처리방침에 동의합니다. (필수)'}
                        isActive={isActive}
                        setIsActive={setIsActive}
                    />
                    <S.verify_btn_wrapper>
                        <AuthBtn radius50={false} name={'완료'} onClick={Btnhandler}/>
                    </S.verify_btn_wrapper>
                </S.verify_check_wrapper>
            </S.verify_content>
        </S.container>
    );
}

export default VerifyStep;