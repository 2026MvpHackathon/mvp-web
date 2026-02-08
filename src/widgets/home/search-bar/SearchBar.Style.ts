import styled from "styled-components";
import * as token from "@/shared/values/token";

export const SearchInputWrapper = styled.div`
  position: relative;
  width: 18.75rem;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 2rem;
  border-radius: ${token.shapes.small};
  background-color: ${token.colors.fill.alternative2};
  color: ${token.colors.text.normal};
  border: none;
  padding: 0.5rem 4rem 0.5rem 0.5rem;
  ${token.typography("caption", "md", "regular")}

  &:focus {
    outline: none;
  }
`;


export const IconContainer = styled.div`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 0.5rem;
`;

export const IconButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const Icon = styled.img`
  width: 1rem;
  object-fit: cover;
`;

export const CancelIcon = styled.img`
  width: 0.9rem;
  object-fit: cover;
`;


