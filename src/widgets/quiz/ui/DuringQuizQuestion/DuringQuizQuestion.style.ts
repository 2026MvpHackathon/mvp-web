import { colors, flexColumn, typography  } from '@/shared/values/token'
import styled from 'styled-components'

export const container = styled.div`
    ${flexColumn};
    gap: 0.75rem;
    width: 100%;
    padding: 0.625rem 0;
`

export const title = styled.span`
    color: ${colors.main.normal};
    ${typography("heading","md","regular")}
`

export const question_wrapper = styled.div`
    width: 100%;
    ${flexColumn};
    padding: 0.625rem 0.5rem;
    gap: 1.75rem;
`
export const question_text = styled.p`
    color: ${colors.text.normal};
    ${typography("body","lg","medium")}
    margin: 0px;
`
export const question_commentary = styled(question_text)`
    color: ${colors.text.strong};
`