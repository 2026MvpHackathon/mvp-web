import styled from "styled-components";
import * as token from "@/shared/values/token";

export const Layout = styled.div`
  display: flex;
  gap: 3rem;
  width: 100%;
  min-height: 100%;
`;

export const LeftPanel = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex-shrink: 0;
  width: 15.625rem;
  padding: 1.25rem;
  margin-top: 1.8rem;
`;

export const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-width: 0;
  width: 64.625rem;
  padding: 2.25rem;
`;

export const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.875rem;
`;

export const StartQuizButton = styled.button<{ $active?: boolean }>`
  width: 8.25rem;
  height: 2.625rem;
  background-color: ${({ $active }) =>
    $active ? token.colors.main.alternative : token.colors.fill.alternative2};
  color: ${({ $active }) =>
    $active ? token.colors.text.normal : token.colors.text.alternative2};
  border: none;
  border-radius: ${token.shapes.small};
  ${token.typography("body", "md", "medium")};
  cursor: ${({ $active }) => ($active ? "pointer" : "not-allowed")};

  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: ${({ $active }) =>
      $active ? token.colors.main.alternative : token.colors.fill.alternative2};
  }

  &:active {
    background-color: ${({ $active }) =>
      $active ? token.colors.main.alternative : token.colors.fill.alternative2};
  }
`;



export const ProductSelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
`;

export const SelectAllWrapper = styled.div`
  width: 100%;
  display: flex;
`;

export const ProductGridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  max-height: 651.13px;
  overflow-y: scroll;
`;

export const AverageRateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  height: 8.4375rem;
  border: 1px solid ${token.colors.fill.alternative2};
  border-radius: ${token.shapes.small};
  background-color: #0D0D0D;
  gap: 0.5rem;
`;


export const AverageRateValue = styled.span`
  ${token.typography("heading", "lg", "semibold")};
  color: ${token.colors.text.strong};
`;

export const AverageRateDescription = styled.span`
  ${token.typography("caption", "sm", "medium")};
  color: ${token.colors.text.alternative2};
`;

export const StartQuizButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;
