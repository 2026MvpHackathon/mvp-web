import styled from "styled-components";
import * as token from "@/shared/values/token"

export const container = styled.div`
  width: 18.75rem;
  height: auto;
  background-color: ${token.colors.fill.alternative4};
  padding: 1rem 1.25rem;
  border-radius: ${token.shapes.small};
  ${token.flexColumn}
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  overflow: hidden;
`;

export const infoContainer = styled.div`
  width: 100%;
  ${token.flexColumn}
  gap: 0.3125rem;
`;

export const titleArrowContainer = styled.div`
  width: auto;
  ${token.flexRow}
  align-items: center;
  justify-content: space-between;
`;

export const title = styled.span`
  ${token.typography("heading", "sm", "semibold")}
`;

export const openArrow = styled.img`
  width: 0.8125rem;
  height: 0.6875rem;
`;

export const detail = styled.span`
  ${token.typography("caption", "sm", "regular")}
  color: ${token.colors.secondary.alternative};
`;

export const objectImg = styled.img`
  object-fit: contain;
  height: 7rem;
`