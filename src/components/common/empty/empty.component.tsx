import { StyledEmpty } from './empty.styled';
import { Footer } from '../footer/footer.component';

export const Empty: React.FC = () => {
  return (
    <>
      <StyledEmpty>
        <div className="empty-image-containter">
          <img src="/images/no-data.svg" alt="No data image" />
        </div>
        <p className="empty-description">No data found</p>
      </StyledEmpty>
      <Footer />
    </>
  );
};
