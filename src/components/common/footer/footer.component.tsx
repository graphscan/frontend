import styled from 'styled-components';
import { FooterContainer } from '../footer-container/footer-container.styled';

const Container = styled(FooterContainer)`
  padding: 40px 0;
`;

export const Footer: React.FC = () => {
  return (
    <footer>
      <Container />
    </footer>
  );
};
