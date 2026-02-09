import styled from "styled-components";
import * as token from "@/shared/values/token"

export const container = styled.div`
  width: 21.53rem;
  height: 12.4375rem;
  padding: 1rem 1.25rem;
  background-color: ${token.colors.fill.alternative3};
  border-radius: ${token.shapes.small};
`;

export const item = styled.div`
  ${token.flexColumn}
  align-items: end;
  gap: 1rem;
`;

export const infoContainer = styled.div`
  width: 100%;
  ${token.flexColumn}
  gap: 0.3125rem;
`;

export const titleTimeContainer = styled.div`
  width: auto;
  ${token.flexRow}
  align-items: center;
  justify-content: space-between;
`;

export const title = styled.span`
  ${token.typography("heading", "sm", "semibold")}
`;

export const time = styled.span`
  ${token.typography("caption", "sm", "regular")}
  color: ${token.colors.line.neutral};
`;

export const detail = styled.span`
  ${token.typography("caption", "sm", "regular")}
  color: ${token.colors.line.neutral};
`;

export const bottom = styled.div`
  width: 100%;
  ${token.flexRight}
`

export const img = styled.img`
  width: 10rem;
  object-fit: cover;
`;

export const openButtonContainer = styled.div`
  width: 8.5rem;
  height: 5.5rem;
  ${token.flexRow}
  align-items: flex-end;
`

export const openButton = styled.button`
  width: 3.8125rem;
  height: 1.875rem;
  background-color: ${token.colors.fill.assistive};
  ${token.typography("caption", "lg", "semibold")}
  color: ${token.colors.text.normal};
  border-radius: ${token.shapes.small};
`