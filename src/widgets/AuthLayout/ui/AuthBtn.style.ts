import { flexCenter } from "@/shared/values/_flex";
import styled from "styled-components";
import { rgba } from 'polished' // 투명도 라이브러리
import { colors } from "@/shared/values/_foundation";
import { typography } from "@/shared/values/typography.mixin";

export const btn_container = styled.button`
    ${flexCenter}

    width: 100%;
    padding: 16px 0px;

    opacity: 0.8;
    background: rgba(8, 9, 9, 0.10);
    border: 1px solid #666D6A; // glass 임시
`

export const btn_text = styled.span`
    color: ${rgba(colors.main.normal, 0.7)};
    ${typography("body", "md", "semibold")}; 
`