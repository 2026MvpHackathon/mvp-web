import AuthLayoutBtn from './AuthBtn';
import AuthInput from './AuthInput';
import * as S from './AuthInputField.style'

interface InputConfig {
    name: string;
    placeholder: string;
}

interface InputFieldNameProps {
    main: string;
    sub: string;
    inputs: InputConfig[];  // 객체 배열
    btn: string;
    onClick: () => void;
}

const AuthInputField = ({main, sub, inputs, btn, onClick}: InputFieldNameProps) => {
    return(
        <S.container>
            <S.input_field_name>
                <S.input_field_name_large_text>{main}</S.input_field_name_large_text>
                <S.input_field_name_small_text>{sub}</S.input_field_name_small_text>
            </S.input_field_name>
            <S.input_btn_container>
                <S.input_btn__wrapper>
                    {inputs.map((item, index) => (
                        <AuthInput key={index} title={item.name} isActive={false} placeholder={item.placeholder}/>
                    ))}
                </S.input_btn__wrapper>
                <AuthLayoutBtn radius50={false} name={btn} onClick={onClick}/>
            </S.input_btn_container>
        </S.container>
    );
}

export default AuthInputField;