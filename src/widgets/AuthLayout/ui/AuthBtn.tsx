import * as S from './AuthBtn.style'

interface BtnRadiusResponse {
    radius50: boolean;
    name: string;
}

const AuthBtn = ({radius50, name}: BtnRadiusResponse) => {
    return(
        <S.btn_container style={radius50? {borderRadius:'50px'}:{borderRadius: '14px'}}>
            <S.btn_text>
                {name}
            </S.btn_text>
        </S.btn_container>
    );
}

export default AuthBtn;