import styled from "styled-components";
import * as token from "@/shared/values/token";

export const SearchInputWrapper = styled.div`
  position: relative;
  width: 18.75rem;
`;

export const IconWrapper = styled.div`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 2rem;
  border-radius: ${token.shapes.small};
  background-color: ${token.colors.fill.alternative2};
  color: ${token.colors.text.normal};
  border: none;

  padding: 0.5rem 2rem 0.5rem 0.5rem;

  ${token.typography("caption", "md", "regular")}

  &:focus {
    outline: none;
  }
`;

export const SearchIcon = styled.img`
  width: 1rem;
  object-fit: cover;
`
