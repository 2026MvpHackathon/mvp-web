import { flexCenter } from "@/shared/values/_flex";
import styled from "styled-components";
import { rgba } from 'polished' // 투명도 라이브러리
import { colors } from "@/shared/values/_foundation";
import { typography } from "@/shared/values/typography.mixin";
import { glassEffect } from "@/shared/ui/GlassEffect";

export const btn_container = styled.button`
    ${flexCenter}

    width: 100%;
    padding: 16px 0px;

    opacity: 0.8;
    ${glassEffect}
    background: rgba(0, 0, 0, 0.25);

    cursor: pointer;

    &:hover {
        background: rgba(64, 64, 64, 0.25);
    }
`

export const btn_text = styled.span`
    color: ${rgba(colors.main.normal, 0.7)};
    ${typography("body", "md", "semibold")}; 
`