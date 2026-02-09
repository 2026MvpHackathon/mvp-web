import VisibilityOff from '@/assets/icons/VisibilityOff';
import * as S from './AuthInput.style'
import type { FieldError, UseFormRegister } from 'react-hook-form';

interface AuthInputProps {
    title: string;
    placeholder: string;
    name?: 'email' | 'password' | 'code' | 'passwordConfirm'; 
    type?: 'text' | 'password' | 'email' | 'number';
    register?: UseFormRegister<any>;
    error?: FieldError;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
}

const AuthInput = ({title, placeholder, name, type = 'text', register, error, onChange, value}: AuthInputProps) => {
    return(
        <S.input_container>
            <S.input_fieldname>{title}</S.input_fieldname>
            <S.input_field $isError={!!error}>
                <S.input_wrapper>
                    <S.input_input 
                        placeholder={placeholder} 
                        type={type} 
                        {...(register && name ? register(name) : { onChange, value })} // Conditionally apply register or onChange/value
                    />
                    {type === 'password' && <VisibilityOff size={'23px'}/>}
                </S.input_wrapper>
            </S.input_field>
            {error && <S.ErrorText>{error.message}</S.ErrorText>}
        </S.input_container>
    );
}

export default AuthInput;