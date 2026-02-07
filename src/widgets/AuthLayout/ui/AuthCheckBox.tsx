import * as S from './AuthCheckBox.style'
import AuthCheckBoxOn from '@/assets/AuthCheckBoxOn.png'
import AuthCheckBoxOff from '@/assets/AuthCheckBoxOff.png'
import { useState } from 'react';

interface checkBoxProps {
    large: boolean; 
    text: string;
}

const AuthCheckBox = ({large, text}: checkBoxProps) => {
    const [isActive, setIsActive] = useState(false)

    const handleClick = () => {
        setIsActive(!isActive)
    }

    return(
        <S.wrapper>
            <img src={isActive? AuthCheckBoxOn: AuthCheckBoxOff} width="30px" alt="test" onClick={handleClick}/>
            {large?
                <S.checkbox_text_large>{text}</S.checkbox_text_large>
            :
                <S.checkbox_text_small>{text}</S.checkbox_text_small>
            }
        </S.wrapper>
    );
}

export default AuthCheckBox;