import styled from 'styled-components'
import { flexColumn } from '@/shared/values/_flex';
import { colors } from '@/shared/values/_foundation';


export const guide_wrapper = styled.div`
    width: 28.125rem;
    height: auto;

    ${flexColumn}
`
export const guide_large_text = styled.p`
    width: 100%;
    height: auto;

    color: ${colors.main.normal};
    
    font-family: "Aoboshi One";
    font-size: 5rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`
export const guide_small_text = styled.div`
    width: 100%;
    height: auto;

    color: ${colors.secondary.assistive};
    font-family: "Aoboshi One";
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`
