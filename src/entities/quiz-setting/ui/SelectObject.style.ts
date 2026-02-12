                                
                                
import styled from "styled-components";
import * as token from "@/shared/values/token";

export const Container = styled.div<{ $selected: boolean }>`
  width: 13.4375rem;
  height: 10.98375rem;
  border: 1px solid ${({ $selected }) => ($selected ? token.colors.text.strong : token.colors.text.alternative2)};
  border-radius: ${token.shapes.small};
  padding: 0.9375rem;
  ${token.flexColumn}
`;

export const TitleSelectContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.span`
  ${token.typography("heading", "sm", "semibold")}
`;

export const Circle = styled.div<{ $selected: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background-color: ${({ $selected }) => ($selected ? token.colors.text.strong : token.colors.text.alternative2)};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Icon = styled.img`
  width: 0.78125rem;
  height: 0.546875rem;
`;

export const ObjectImgContainer = styled.div`
  width: 100%;
  height: 6.5rem;       // 카드 안에서 차지할 높이 고정
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const objectImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
                            