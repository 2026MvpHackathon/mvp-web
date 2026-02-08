import { flexColumn, colors, typography } from "@/shared/values/token";
import styled from "styled-components";

export const container = styled.div`
    ${flexColumn}
    padding: 2.5rem 3.3125rem;
    gap: 10px;
    display: inline-flex;
`

export const accuracy_rate = styled.span`
    color: ${colors.text.strong};
    text-align: center;
    ${typography("heading", "lg", "semibold")}
`

export const small_text = styled.span`
    color: ${colors.text.alternative2};
    ${typography("heading", "lg", "medium")}
    font-size: 10px;
    font-style: normal;
`