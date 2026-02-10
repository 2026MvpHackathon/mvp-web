import styled from "styled-components";
import * as token from "@/shared/values/token";

export const Container = styled.div<{ $selected: boolean }>`
  width: 13.4375rem; /* Same width as SelectObject for consistency */
  height: 10.98375rem; /* Same height as SelectObject for consistency */
  border: 1px solid ${({ $selected }) => ($selected ? token.colors.text.strong : token.colors.text.alternative2)};
  border-radius: ${token.shapes.small};
  padding: 0.9375rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Removed space-between */
  align-items: flex-start; /* Aligned text to the start */
  cursor: pointer;
  box-sizing: border-box;
`;

export const AnswerText = styled.p`
  ${token.typography("body", "md", "regular")};
  color: ${token.colors.text.normal};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5; /* Limit to 5 lines */
  -webkit-box-orient: vertical;
  margin: 0;
  text-align: left;
`;
