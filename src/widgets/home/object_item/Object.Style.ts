import styled from "styled-components";
import * as token from "@/shared/values/token";

export const container = styled.div`
  ${token.flexRow}
  flex-wrap: wrap;
  gap: 1.25rem;    

  & > * {
    
    width: calc((100% - (1.25rem * 3)) / 4);
    min-width: 200px; 
  }
`;