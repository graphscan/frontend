import styled from 'styled-components';
import { PreloaderBackground } from '../background/background.styled';
import { Footer } from '../footer/footer.component';
import { Spinner } from '../spinner/spinner.component';

const Preloader = styled(PreloaderBackground)`
  background-color: #192434;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

type Props = {
  withFooter?: boolean;
};

export const TabPreloader: React.FC<Props> = ({ withFooter = true }) => {
  return (
    <>
      <Preloader>
        <Spinner />
      </Preloader>
      {withFooter && <Footer />}
    </>
  );
};
