import { colors, flexColumnCenter, flexColumnStart, typography } from '@/shared/values/token';
import styled from 'styled-components';

// SelectLoginOrSignup
export const login_or_signup_wrapper = styled.div`
    ${flexColumnStart}
    gap: 0.5rem;

    width: 100%;
`

export const login_or_signup_guide_text = styled.p`
    color: ${colors.text.neutral};
    ${typography("caption", "md", "medium")}; 

    width: 100%;
    text-align: start;
`

// SelectLoginOrSignup

export const container = styled.div`
    ${flexColumnCenter}
    display: flex;
    gap: 2.5rem;

    width: 18.75rem;
    height: auto;
`