import AuthLayoutBtn from './AuthLayoutBtn';
import AuthLayoutInput from './AuthLayoutInput';
import * as S from './AuthLayoutInputField.style'

const InputFieldName = () => {
    return(
        <S.input_field_name>
            <S.input_field_name_large_text>회원가입</S.input_field_name_large_text>
            <S.input_field_name_small_text>로그인 정보를 입력해주세요.</S.input_field_name_small_text>
        </S.input_field_name>
    );
}

const AuthLayoutInputField = () => {
    return(
        <S.container>
            <InputFieldName/>
            <S.input_btn_container>
                <AuthLayoutInput/>
                <AuthLayoutBtn radius50={false}/>
            </S.input_btn_container>
        </S.container>
    );
}

export default AuthLayoutInputField;