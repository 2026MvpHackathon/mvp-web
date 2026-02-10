import styled from 'styled-components'
import { flexColumnCenter } from '@/shared/values/_flex'
import { typography } from '@/shared/values/typography.mixin'
import { colors } from '@/shared/values/_foundation'

export const container = styled.div`
    ${flexColumnCenter};
    width: 100vw;
    height: 100vh;
    position: relative;
`

export const body = styled.div`
    width: 100%;
    height: 100%;

    padding: 2.25rem 2.5rem;
`

// blur

export const blur_overlay = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.25);

  z-index: 100;
  pointer-events: none; /* 아래 클릭 허용 */
`

export const top_ui = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;

  ${flexColumnCenter};
  gap: 2.25rem;
  width: 100%; // 너비를 100%로 변경
`

export const text_wrapper = styled.div`
    width: 100%;
    ${flexColumnCenter};
`

export const accuracy_rate = styled.span`
    ${typography("heading","xxl","bold")};
    color: ${colors.text.strong};
`

export const evaluation = styled.span`
    ${typography("heading","lg","semibold")};
    color: ${colors.text.normal};
    white-space: pre;
`
