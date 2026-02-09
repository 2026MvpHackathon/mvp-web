import VisibilityOff from '@/assets/icons/VisibilityOff';
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
                        type={type} 
                        {...inputProps}
                    />
                    {type === 'password' && <VisibilityOff size={'23px'}/>}
                </S.input_wrapper>
            </S.input_field>
            {props.error && <S.ErrorText>{props.error.message}</S.ErrorText>}
        </S.input_container>
    );
}

export default AuthInput;