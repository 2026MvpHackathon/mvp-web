import AuthLayoutBtn from './AuthBtn';
import AuthInput from './AuthInput';
import * as S from './AuthInputField.style'

interface InputFieldNameProps {
    main: string;
    sub: string;
    inputName: string;
}

const AuthInputField = ({main, sub, inputName}: InputFieldNameProps) => {
    return(
        <S.container>
            <S.input_field_name>
                <S.input_field_name_large_text>{main}</S.input_field_name_large_text>
                <S.input_field_name_small_text>{sub}</S.input_field_name_small_text>
            </S.input_field_name>
            <S.input_btn_container>
                <AuthInput/>
                <AuthLayoutBtn radius50={false}/>
            </S.input_btn_container>
        </S.container>
    );
}

export default AuthInputField;