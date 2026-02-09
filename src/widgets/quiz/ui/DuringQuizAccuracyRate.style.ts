import { colors, typography, shapes, flexColumnCenter } from "@/shared/values/token";
import styled from "styled-components";

export const container = styled.div`
    ${flexColumnCenter}
    width: 13.125rem;
    gap: 10px;
    padding: 2.5rem 0;

    border-radius: ${shapes.small};
    border: 1px solid ${colors.fill.alternative3};
    background: #0D0D0D;
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