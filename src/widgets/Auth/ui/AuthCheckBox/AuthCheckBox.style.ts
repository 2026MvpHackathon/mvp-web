import { flexLeft } from '@/shared/values/_flex';
import { colors, typography } from '@/shared/values/token';
import styled from 'styled-components';
import { rgba } from 'polished' // 투명도 라이브러리

export const wrapper = styled.div`
    ${flexLeft}
    align-items: center;
    gap: 0.5rem;

    width: 100%;
    height: auto;

`

export const checkbox_text_large = styled.text`
color: ${rgba(colors.main.normal, 0.7)};
${typography("body", "md", "semibold")}; 
`
export const checkbox_text_small = styled(checkbox_text_large)`
${typography("caption", "md", "medium")}; 
`

