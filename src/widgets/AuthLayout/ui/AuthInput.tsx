import VisibilityOff from '@/assets/icons/VisibilityOff';
import * as S from './AuthInput.style'

const AuthInput = () => {
    return(
        <S.input_container>
            <S.input_fieldname>이메일</S.input_fieldname>
            <S.input_field>
                <S.input_wrapper>
                    <S.input_input/>
                    <VisibilityOff size={'23px'}/>
                </S.input_wrapper>
            </S.input_field>
        </S.input_container>
    );
}

export default AuthInput;