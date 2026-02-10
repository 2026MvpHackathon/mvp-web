import styled from "styled-components";
import * as token from "@/shared/values/token";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const DropdownWrapper = styled.div`
  position: relative;
  width: fit-content;
`;

export const DropdownBox = styled.div`
  min-width: 4.5rem;
  height: 2rem;
  padding: 0 0.75rem;

  border: 1px solid ${token.colors.line.alternative};
  border-radius: ${token.shapes.small};

  display: flex;
  align-items: center;
  justify-content: space-between;

  cursor: pointer;
`;

export const Value = styled.span`
  ${token.typography("body", "sm", "medium")};
`;

export const Arrow = styled.span<{ $open: boolean }>`
  font-size: 0.75rem;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0)")};
  transition: transform 0.2s ease;
`;

export const Label = styled.span`
  ${token.typography("body", "md", "semibold")};
  color: ${token.colors.text.normal};
`;

export const OptionList = styled.ul`
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;

  width: 100%;
  max-height: 8rem;
  overflow-y: auto;

  background-color: ${token.colors.background.Dark};
  border: 1px solid ${token.colors.line.alternative};
  border-radius: ${token.shapes.small};

  padding: 0.25rem 0;
  z-index: 10;


  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${token.colors.line.alternative};
    border-radius: 0.25rem;
  }
`;

export const Option = styled.li`
  padding: 0.375rem 0.75rem;
  cursor: pointer;

  ${token.typography("body", "md", "medium")};

  &:hover {
    background-color: ${token.colors.background.Dark};
  }
`;
