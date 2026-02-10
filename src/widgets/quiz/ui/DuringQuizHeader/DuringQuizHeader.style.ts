import { flexBetween, flexColumnStart, flexRow } from "@/shared/values/_flex";
import { colors, typography } from "@/shared/values/token";
import styled from "styled-components";

// top
export const header_container = styled.div`
    ${flexColumnStart}
    justify-content: center;
    padding: 0 1.5rem;
    gap: 0.625rem;
    width: 100%;
`

export const header_top_container = styled.div`
    ${flexBetween}
    align-items: center;
    padding: 4px 24px 4px 0;
    width: 100%;
`
export const header_top_front_wrapper = styled.div`
    ${flexRow};
    align-items: center;
    gap: 1rem;
    position: relative;
`

export const header_top_range_text = styled.span`
    ${typography("body",'md','medium')};
    color: ${colors.secondary.alternative};

`

// middle
export const header_Quiz_title = styled.span`
    ${typography("heading",'xl','semibold')};
    color: ${colors.main.normal};
`

// bottom - 진행바
export const header_bottom_container = styled.div`
    padding-right: 16px;
    gap: 1.75rem;
    ${flexRow}
    align-items: center;
    width: 100%;
`

export const ProgressBarWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 3px;
    flex: 1;
`

export const ProgressBarBackground = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${colors.secondary.normal};
    border-radius: 1.5px;
`

export const ProgressBarFill = styled.div<{ progress: number }>`
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => props.progress}%;
    height: 3px;
    background-color: ${colors.main.normal};
    border-radius: 1.5px;
    transition: width 0.3s ease-in-out;
`

export const header_bottom_progress_percent_wrapper = styled.div`
    width: auto;
    white-space: nowrap;
    ${flexRow}; // 진행 텍스트와 퍼센트가 한 줄에 오도록
    align-items: center;
    gap: 4px; // 요소들 사이 간격
`
export const header_bottom_question_status = styled.span`
    color: ${colors.text.normal};
    ${typography("heading",'sm','medium')};
    margin-right: 8px; // 퍼센트와 구분
`
export const header_bottom_progress_percent_numb = styled.span`
    color: ${colors.text.normal};
    ${typography("heading",'sm','medium')};
`
export const header_bottom_progress_percent = styled.span`
    color: ${colors.main.assistive};
    ${typography("heading",'sm','medium')};
`