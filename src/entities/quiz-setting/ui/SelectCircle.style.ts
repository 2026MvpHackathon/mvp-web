import styled from "styled-components";
import * as token from "@/shared/values/token";

export const Wrapper = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  cursor: pointer;
`;

export const Circle = styled.div<{ $selected: boolean }>`
  width: 1.375rem;
  height: 1.375rem;
  border-radius: 50%;

  background-color: ${({ $selected }) =>
    $selected
      ? token.colors.text.strong
      : token.colors.text.alternative2};

  display: flex;
  align-items: center;
  justify-content: center;

  transition: background-color 0.2s ease;
`;

export const Icon = styled.img`
  width: 0.78125rem;
  height: 0.546875rem;
`;

export const Label = styled.span<{ $selected: boolean }>`
  ${token.typography("body", "sm", "semibold")};
  color: ${token.colors.text.normal};
`;
