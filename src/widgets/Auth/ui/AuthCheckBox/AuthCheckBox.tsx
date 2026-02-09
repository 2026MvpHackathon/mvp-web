import * as S from './AuthCheckBox.style'
import AuthCheckBoxOn from '@/assets/AuthCheckBoxOn.png'
import AuthCheckBoxOff from '@/assets/AuthCheckBoxOff.png'

interface checkBoxProps {
    large: boolean; 
    text: string;
    isActive: boolean;
    setIsActive: (isActive: (prevState: boolean) => boolean) => void; 
}

const AuthCheckBox = ({large, text, isActive, setIsActive}: checkBoxProps) => { 

    const handleClick = () => {
        setIsActive(prev => !prev) 
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