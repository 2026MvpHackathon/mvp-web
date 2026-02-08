import styled from "styled-components";
import * as token from "@/shared/values/token"

export const container = styled.div`
  width: 100%;
  max-width: 82.5rem;
  margin: 0 auto;
  height: 15.5rem;
  ${token.flexColumn}
  gap: 3rem;
  margin-bottom: 2rem;
`
export const recentContainer = styled.div`
  ${token.flexColumn}
  gap: 1.875rem;
`

export const divider = styled.div`
  width: 100%;
  height: 3px;
  min-height: 3px;
  background-color: ${token.colors.line.alternative3};
  border-radius: ${token.shapes.small};
`;

export const objectContainer = styled.div`
  ${token.flexColumn}
  gap: 1.875rem;
`

export const titleSearch = styled.div`
  ${token.flexRow}
  align-items: center;
  justify-content: space-between;
`

export const title = styled.span`
  ${token.typography("heading", "md", "semibold")}
`