import { flexBetween, flexColumnStart, flexRow } from "@/shared/values/_flex";
import { colors } from "@/shared/values/_foundation";
import { typography } from "@/shared/values/typography.mixin";
import { rgba } from 'polished' // 투명도 라이브러리
import styled from "styled-components";

export const input_container = styled.div`
    ${flexColumnStart}
    width: 100%;
    height: auto;
    gap: 1.875rem;
`
export const input_fieldname = styled.p`
    width: 100%;
    
    color: ${colors.main.normal};
    ${typography("heading", "sm", "semibold")};
    
`

export const input_field = styled.div`
    width: 100%;
    height: auto;
    padding-bottom: 1.0313rem;

    ${flexColumnStart}
    gap: 1rem;

    border-bottom: 1px solid rgba(183, 201, 185, 0.20);
`

export const input_wrapper = styled.div`
    ${flexRow}
    padding-right: 20px;
    gap: 0.75rem;

    width: 100%;
    height: auto;
`

export const input_input = styled.input`
    width: 100%; 
    color: ${rgba(colors.main.normal, 0.8)};
    ${typography("body", "md", "semibold")};

    background: none;
    border: none;

    &:placeholder {
        color: ${rgba(colors.main.normal, 0.7)};
    }

    &:focus{
        outline: none; 
    }
`
