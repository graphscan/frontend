import styled from 'styled-components';

export const Controls = styled.div`
  margin-left: 10px;
  display: flex;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  .controls-indexer-cut {
    margin-left: 20px;
    @media (max-width: 768px) {
      margin-left: 0;
    }
  }

  .controls-switch-box {
    margin-left: 10px;
    display: flex;
  }
`;
