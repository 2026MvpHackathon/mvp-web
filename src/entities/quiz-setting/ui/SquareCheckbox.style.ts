import styled from "styled-components";
import * as token from "@/shared/values/token";

export const Wrapper = styled.div<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  cursor: pointer;
  width: 6.25rem;
`;

export const Box = styled.div<{ $checked: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.25rem;

  background-color: ${({ $checked }) =>
    $checked
      ? token.colors.text.strong
      : token.colors.text.alternative2};

  display: flex;
  align-items: center;
  justify-content: center;

`;

export const CheckIcon = styled.img`
  width: 0.78125rem;
  height: 0.546875rem;
`;

export const Label = styled.span<{ $checked: boolean }>`
  ${token.typography("caption", "md", "medium")};
`;
