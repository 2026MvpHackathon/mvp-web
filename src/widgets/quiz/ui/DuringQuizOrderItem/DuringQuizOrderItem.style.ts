import { colors, flexCenter, typography } from "@/shared/values/token";
import styled from "styled-components";

export const container = styled.div`
    ${flexCenter}
    gap: 1.25rem;
    display: inline-flex;
`
export const text = styled.text`
    color: ${colors.text.normal}
    ${typography("body",'lg','semibold')}
`