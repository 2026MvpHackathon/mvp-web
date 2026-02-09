import AuthBtn from '../AuthBtn/AuthBtn';
import AuthInput from '../AuthInput/AuthInput';
import * as S from './AuthInputField.style'
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

export interface InputConfig {
    name: string;
    placeholder: string;
    fieldName?: 'email' | 'password' | 'code' | 'passwordConfirm';
    type?: 'text' | 'password' | 'email' | 'number'; 
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
}

interface InputFieldNameProps {
    main: string;
    sub: string;
    inputs: InputConfig[];  
    btn: string;
    register?: UseFormRegister<any>; 
    errors?: FieldErrors<any>; 
    generalError?: string;
    onClick?: () => void;
}

const AuthInputField = ({main, sub, inputs, btn, register, errors, generalError, onClick}: InputFieldNameProps) => {
    return(
        <S.container>
            <S.input_field_name>
                <S.input_field_name_large_text>{main}</S.input_field_name_large_text>
                <S.input_field_name_small_text>{sub}</S.input_field_name_small_text>
            </S.input_field_name>
            <S.input_btn_container>
                <S.input_btn__wrapper>
                    {inputs.map((item, index) => (
                        <AuthInput 
                            key={index} 
                            title={item.name} 
                            placeholder={item.placeholder} 
                            name={item.fieldName}
                            type={item.type}
                            register={register}
                            error={item.fieldName && errors ? errors[item.fieldName] : undefined} // Conditionally pass error
                            onChange={item.onChange}
                            value={item.value}
                        />
                    ))}
                </S.input_btn__wrapper>
                {generalError && <S.ErrorText>{generalError}</S.ErrorText>}
                <AuthBtn radius50={false} name={btn} type={onClick ? "button" : "submit"} onClick={onClick} />
            </S.input_btn_container>
        </S.container>
    );
}

export default AuthInputField;