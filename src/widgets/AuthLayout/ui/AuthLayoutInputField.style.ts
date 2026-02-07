import { flexColumn } from "@/shared/values/_flex";
import { colors } from "@/shared/values/_foundation";
import { typography } from "@/shared/values/typography.mixin";
import styled from "styled-components";

//InputField
export const container = styled.div`
    width: 530px; // 임시
    height: auto;
    ${flexColumn}
    align-items: center;
    gap: 5.75rem;
`
export const input_btn_container = styled.div`
    ${flexColumn}
    gap: 5rem;
    width: 100%;
`


// InputFieldName
export const input_field_name = styled.div`
    ${flexColumn}
    align-items: center;
    gap: 1rem;
`

export const input_field_name_large_text = styled.p`
    color: ${colors.main.normal};
    ${typography("heading", "xxl", "semibold")};
    text-align: center;
    
`

export const input_field_name_small_text = styled.p`
    color: ${colors.secondary.assistive};
    ${typography("body", "md", "semibold")};
    text-align: center;
`
