import { StyledEmpty } from "./empty.styled";
import { Footer } from "../footer/footer.component";

type Props = {
  withoutFooter?: boolean;
};

export const Empty: React.FC<Props> = ({ withoutFooter = false, ...rest }) => {
  return (
    <>
      <StyledEmpty {...rest}>
        <div className="empty-image-containter">
          <img src="/images/no-data.svg" alt="No data image" />
        </div>
        <p className="empty-description">No data found</p>
      </StyledEmpty>
      {!withoutFooter && <Footer />}
    </>
  );
};
