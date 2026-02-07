import { flexColumnCenter, flexColumn, flexCenter, flexBetween } from "@/shared/values/_flex";
import { colors, typography } from "@/shared/values/token";
import styled from "styled-components";

export const container = styled.div`
    ${flexColumnCenter}
    gap: 4rem;
`

export const verify_title = styled.p`
    color: ${colors.main.normal};
    ${typography("heading", "xxl", "semibold")}; 

    width: 100%;
    text-align: center;
`

export const verify_content = styled.div`
    ${flexColumnCenter}
    gap: 2.125rem;
`

export const verify_explanation = styled.div`
    ${flexColumn}
    width: 100%;
    max-width: 29.375rem;
    height: 21.25rem;
    padding: 1.5rem 1.25rem;
    gap: 0.625rem;

    border-radius: 1.25rem;
    border: 0.5px solid rgba(92, 97, 88, 0.60);

    overflow-y: scroll;
`

export const verify_explanation_text = styled.p`
    color: rgba(231, 239, 218, 0.70);
    ${typography("body", "md", "semibold")}; 
    height: 100%;
    word-wrap: break-word;
    word-break: keep-all;
    white-space: pre-wrap;
`

export const verify_check_wrapper = styled.div`
    width: 100%;
    height: auto;

    ${flexBetween}
`

export const verify_btn_wrapper = styled.div`
    width: 8.75rem;
    height: auto;
`