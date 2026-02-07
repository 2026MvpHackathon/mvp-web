import styled from 'styled-components';
import { flexBetween } from '@/shared/values/_flex';
import { typography } from '@/shared/values/typography.mixin';
import { colors } from '@/shared/values/_foundation';
import { shapes } from '@/shared/values/_shape';
import { Link } from 'react-router-dom';

export const header_container = styled.div`
    ${flexBetween};
    align-items: center;
    width: 100%;
    padding: 0.8438rem 3.9375rem;
    border-bottom: 0.5px solid var(--Line-Alternative-3, ${colors.line.alternative3});
    background: ${colors.background.Dark};
    box-shadow: 0 2px 25.8px 0 rgba(16, 73, 18, 0.16);
`

export const header_menu_wrapper = styled.div` 
    ${flexBetween};
    width: 8.5625rem;
`

export const header_menu = styled.span<{ $active?: boolean }>`
    ${typography("body", "md", "medium")};
    color: ${({ $active }) => $active? colors.secondary.alternative : colors.main.normal};

    cursor: pointer;

    &:hover {
        color: ${colors.secondary.alternative};      
    }
`


export const header_btn = styled.button`
    padding: 10px 20px;

    border-radius: ${shapes.xsmall};
    border: 1px solid ${colors.main.assistive};
    background: ${colors.background.Dark};

    color: ${colors.main.normal};
    ${typography("caption", "md", "medium")};
`

export const styled_link = styled(Link)`
    
`