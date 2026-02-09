import { flexColumn, flexRight, flexRow } from "@/shared/values/_flex";
import styled from "styled-components";

export const container = styled.div`
    ${flexRow}
    width: 100%;
    height: 100%;
    gap: 1.5rem;
`

// aside
export const aside_container = styled.div`
    ${flexColumn}
    width: 15.625rem;
    padding: 0.625rem 1.25rem;
    gap: 2.5rem;
`

export const aside_order_wrapper = styled.div`
    ${flexColumn};
    align-items: center;
    display: flex;
    padding: 0.625rem 0;
    gap: 1.25rem;
    height: 100%;
    width: 100%;
`

// main content
export const main_container = styled.div`
    width: 100%;
    height: 100%;
    ${flexColumn};
    padding: 0.5rem, 0.75rem;
    gap: 1.5rem;
`

export const main_content_container = styled.div`
    ${flexColumn};
    width: 100%;
    height: 100%;
    padding: 0 1.5rem;
    gap: 1.5rem;
`

export const main_centent_choice_wrapper = styled.div`
    ${flexColumn};
    width: 100%;
    height: 100%;
    gap: 0.75rem;
    padding: 0.625rem;
`
export const main_content_btn_wrapper = styled.div`
    ${flexRight};
    padding: 10px;
    align-items: center;
    gap: 0.75rem;
`