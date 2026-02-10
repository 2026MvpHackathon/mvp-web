import * as S from './AuthBtn.style'

interface BtnRadiusResponse {
    radius50: boolean;
    name: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
}

const AuthBtn = ({radius50, name, onClick, type = "button"}: BtnRadiusResponse) => {
    return(
        <S.btn_container type={type} style={radius50? {borderRadius:'50px'}:{borderRadius: '14px'}} onClick={onClick}>
            <S.btn_text>
                {name}
            </S.btn_text>
        </S.btn_container>
    );
}

export default AuthBtn;