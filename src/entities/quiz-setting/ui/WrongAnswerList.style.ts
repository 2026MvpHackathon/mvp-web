import styled from "styled-components";
import * as token from "@/shared/values/token";
import { colors } from "@/shared/values/token";

export const Wrapper = styled.div`
  width: 13.125rem;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  padding: 0 0 0.5rem;
  ${token.typography("body", "sm", "medium")};
  color: ${token.colors.main.normal};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

export const Divider = styled.hr`
  margin: 0 0 0.5rem;
  border: none;
  border-top: 1.5px solid ${token.colors.line.alternative};
`;

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 12rem;
  overflow-y: auto;
`;

export const Item = styled.li`
  padding: 0.375rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${token.typography("body", "sm", "medium")};
  color: ${token.colors.text.normal};
  cursor: pointer;

  &:hover {
    background-color: ${token.colors.background.Dark};
  }
`;

export const ItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

export const Label = styled.span<{ $db: boolean }>`
  color: ${({  $db }) => ($db? colors.main.normal: colors.text.strong)};
  ${token.typography("body", "md", "medium")};
`

export const ListIcon = styled.img`
  width: 0.81rem;
  height: 0.81rem;
  object-fit: contain;
  flex-shrink: 0;
`;

export const CategoryIcon = styled.div`
  width: 1rem;
  height: 1rem;
`;
