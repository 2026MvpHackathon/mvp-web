import { flexCenter } from "@/shared/values/_flex";
import { colors, shapes, typography } from "@/shared/values/token";
import styled from "styled-components";

interface ButtonProps {
    $V1?: boolean; 
}

export const container = styled.div<ButtonProps>`
    ${flexCenter}
    width: 8.25rem;
    padding: 12px 0px;
    border-radius: ${shapes.small};

    background: ${props => (props.$V1? colors.main.alternative : colors.background.Dark )};
    border: 1px solid ${colors.main.alternative}
`

export const text = styled.div`
    color: ${colors.main.normal}
    ${typography("body","md","medium")}
`