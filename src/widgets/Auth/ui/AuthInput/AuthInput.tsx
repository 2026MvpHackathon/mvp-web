import { useState } from 'react';
import VisibilityOff from '@/assets/icons/VisibilityOff';
import VisibilityOn from '@/assets/icons/VisibilityOn';
import * as S from './AuthInput.style'
import type { FieldError, UseFormRegister } from 'react-hook-form'; 

type AuthInputProps = 
  | {
      title: string;
      placeholder: string;
      type?: 'text' | 'password' | 'email' | 'number';
      register: UseFormRegister<any>;
      name: string; 
      error?: FieldError;
      onChange?: never; 
      value?: never; 
    }
  | {
      title: string;
      placeholder: string;
      type?: 'text' | 'password' | 'email' | 'number';
      onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; 
      value?: string; 
      register?: never; 
      name?: never; 
      error?: never; 
    };

const AuthInput = ({title, placeholder, type = 'text', ...props}: AuthInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = () => {
        setShowPassword(prev => !prev);
    }

    const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

    const inputProps = props.register && props.name
        ? props.register(props.name)
        : { onChange: props.onChange, value: props.value };

    return(
        <S.input_container>
            <S.input_fieldname>{title}</S.input_fieldname>
            <S.input_field $isError={!!props.error}>
                <S.input_wrapper>
                    <S.input_input 
                        placeholder={placeholder} 
                        type={inputType} 
                        {...inputProps}
                    />
                    {type === 'password' && (
                        <div onClick={toggleVisibility} style={{ cursor: 'pointer' }}>
                            {showPassword ? <VisibilityOn size={'23px'}/> : <VisibilityOff size={'23px'}/>}
                        </div>
                    )}
                </S.input_wrapper>
            </S.input_field>
            {props.error && <S.ErrorText>{props.error.message}</S.ErrorText>}
        </S.input_container>
    );
}

export default AuthInput;