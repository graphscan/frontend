import {
  Container,
  Content,
  Image,
  Description,
} from "./technical-works.styled";
import { Footer } from "../../../components/common/footer/footer.component";
import { Glow } from "../../../components/common/glow/glow.component";

export const TechnicalWorks: React.FC = () => {
  return (
    <>
      <Container>
        <Content>
          <Image>
            <img src="/images/technical-works.png" alt="Page not found" />
          </Image>
          <Description>Technical work is underway</Description>
          <Glow src="/images/glow-404.png" />
        </Content>
      </Container>
      <Footer />
    </>
  );
};
