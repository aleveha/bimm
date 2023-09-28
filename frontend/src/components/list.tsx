import styled from "styled-components";

export const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding-left: 0;

  li:not(:last-child) {
    margin-bottom: 12px;
  }
`;
