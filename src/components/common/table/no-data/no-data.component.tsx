import styled from "styled-components";

const StyledNoData = styled.section`
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .no-data-description {
    margin-top: 20px;
  }
`;

export const NoData: React.FC = () => {
  return (
    <StyledNoData>
      <img src="/images/no-data.svg" alt="No data image" />
      <p className="no-data-description">No data found</p>
    </StyledNoData>
  );
};
