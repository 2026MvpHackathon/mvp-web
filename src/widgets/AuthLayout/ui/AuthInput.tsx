import VisibilityOff from '@/assets/icons/VisibilityOff';
import * as S from './AuthInput.style'

interface AuthInputProps {
    title: string;
    isActive: boolean;
}

const AuthInput = ({title}: AuthInputProps) => {
    return(
        <S.input_container>
            <S.input_fieldname>{title}</S.input_fieldname>
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