import { glassEffect } from '@/shared/ui/GlassEffect';
import { flexCenter, flexColumnCenter, flexRow } from '@/shared/values/_flex';
import styled from 'styled-components'

export const container = styled.div`
    ${flexColumnCenter};
    width: 100%;
    height: 100%;
`

export const auth_container = styled.div`
    width: 100%;
    height: 100%;
    background-image: url('/src/assets/AuthBackground.png');
    background-size: cover;

    ${flexRow}
`
export const auth_area_glass_off = styled.div`
    width: 50%;
    height: 100%;

    ${flexCenter}
`

export const auth_area_glass = styled(auth_area_glass_off)`
    ${glassEffect}
`
