import styled from "styled-components";
import * as token from "@/shared/values/token";

export const RangeSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const RangeHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const RangeLabel = styled.span`
  ${token.typography("heading", "sm", "semibold")};
  color: ${token.colors.text.normal};
`;

export const RangeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const CategorySliderWrapper = styled.div`
  width: 13.5rem;
  height: 2.5rem;
  position: relative;
  display: inline-flex;
  padding: 0.5rem;
  border: 1px solid ${token.colors.line.alternative};
  border-radius: ${token.shapes.large};
  background: ${token.colors.fill.alternative4};
`;

export const CategorySliderTrack = styled.div<{ $index: number }>`
  position: absolute;
  top: 50%;
  height: 1.6rem;
  width: 6.125rem;
  transform: translateY(-50%) translateX(${({ $index }) => `calc(${$index * 100}%)`});
  transition: transform 0.25s ease;
  background: ${token.colors.background.Dark};
  border-radius: ${token.shapes.small};
  border: 1px solid ${token.colors.line.alternative};
  pointer-events: none;
`;

export const CategoryOption = styled.button<{ $active: boolean }>`
  position: relative;
  z-index: 1;
  min-width: 6.125rem;
  padding: 0.175rem 0.75rem 0.575rem 0.75rem;
  ${token.typography("body", "sm", "medium")};
  color: ${({ $active }) => ($active ? token.colors.text.strong : token.colors.text.alternative)};
  background: transparent;
  border: none;
  border-radius: ${token.shapes.small};
  cursor: pointer;
  transition: color 0.2s ease;
`;
