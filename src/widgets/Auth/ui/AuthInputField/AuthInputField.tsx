import AuthBtn from '../AuthBtn/AuthBtn';
import AuthInput from '../AuthInput/AuthInput';
import * as S from './AuthInputField.style'
import type { FieldErrors, UseFormRegister, FieldError } from 'react-hook-form';

export interface InputConfig {
    name: string;
    placeholder: string;
    fieldName: string; 
    type?: 'text' | 'password' | 'email' | 'number'; 
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; 
    value?: string;
}

interface InputFieldNameProps<TFieldValues extends Record<string, any>> {
    main: string;
    sub: string;
    inputs: InputConfig[];  
    btn: string;
    register?: UseFormRegister<TFieldValues>; 
    errors?: FieldErrors<TFieldValues>; 
    generalError?: string;
    onClick?: () => void;
}

const AuthInputField = <TFieldValues extends Record<string, any>>({main, sub, inputs, btn, register, errors, generalError, onClick}: InputFieldNameProps<TFieldValues>) => {
    return(
        <S.container>
            <S.input_field_name>
                <S.input_field_name_large_text>{main}</S.input_field_name_large_text>
                <S.input_field_name_small_text>{sub}</S.input_field_name_small_text>
            </S.input_field_name>
            <S.input_btn_container>
                <S.input_btn__wrapper>
                    {inputs.map((item, index) => (
                        <
                            AuthInput 
                            key={index} 
                            title={item.name} 
                            placeholder={item.placeholder} 
                            type={item.type}
                            {...(register && item.fieldName ? { register, name: item.fieldName as any, error: errors ? (errors[item.fieldName] as FieldError | undefined) : undefined } : { onChange: item.onChange, value: item.value })}
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