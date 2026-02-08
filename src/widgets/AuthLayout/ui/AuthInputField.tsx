import AuthLayoutBtn from './AuthBtn';
import AuthInput from './AuthInput';
import * as S from './AuthInputField.style'

interface InputFieldNameProps {
    main: string;
    sub: string;
    inputNames: string[];
    btn: string
    onClick: () => void;
}

const AuthInputField = ({main, sub, inputNames, btn, onClick}: InputFieldNameProps) => {
    return(
        <S.container>
            <S.input_field_name>
                <S.input_field_name_large_text>{main}</S.input_field_name_large_text>
                <S.input_field_name_small_text>{sub}</S.input_field_name_small_text>
            </S.input_field_name>
            <S.input_btn_container>
                <S.input_btn__wrapper>
                    {inputNames.map((inputName, index) => (
                        <AuthInput key={index} title={inputName} isActive={false}/>
                    ))}
                </S.input_btn__wrapper>
                <AuthLayoutBtn radius50={false} name={btn} onClick={onClick}/>
            </S.input_btn_container>
        </S.container>
    );
}

export default AuthInputField;