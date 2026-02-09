import styled from "styled-components";
import * as token from "@/shared/values/token"

export const container = styled.div`
  width: 13.4375rem;
  height: 10.98375rem;
  border: solid ${token.colors.text.strong} 1px;
  border-radius: ${token.shapes.small};
  padding: 0.9375rem;
  ${token.flexColumn}
`

export const titleSelectContainer = styled.div`

`

export const title = styled.span`
  ${token.typography("heading", "sm", "semibold")}
`