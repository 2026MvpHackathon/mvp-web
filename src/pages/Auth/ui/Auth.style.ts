import { flexCenter, flexRow } from '@/shared/values/_flex';
import styled from 'styled-components'

export const auth_container = styled.div`
    width: 100%;
    height: 100%;
    background-image: url('/src/assets/AuthBackground.png');
    background-size: cover;

    ${flexRow}
`
export const auth_area = styled.div`
    width: 50%;
    height: 100%;

    ${flexCenter}
`
