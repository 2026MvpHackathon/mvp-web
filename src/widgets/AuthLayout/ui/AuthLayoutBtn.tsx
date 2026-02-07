import * as S from './AuthLayoutBtn.style'

interface BtnRadiusResponse {
    radius50: boolean;
}

const AuthLayoutBtn = ({radius50}: BtnRadiusResponse) => {
    return(
        <S.btn_container>
            <S.btn_text style={radius50? {borderRadius:'50px'}:{borderRadius: '14px'}}>
                Btn
            </S.btn_text>
        </S.btn_container>
    );
}

export default AuthLayoutBtn;