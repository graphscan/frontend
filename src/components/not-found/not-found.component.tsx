import { Container, Content, Image, Description } from "./not-found.styled";
import { Footer } from "../common/footer/footer.component";
import { Glow } from "../common/glow/glow.component";

export const NotFound: React.FC = () => {
  return (
    <>
      <Container>
        <Content>
          <Image>
            <img src="/images/404.png" alt="Page not found" />
          </Image>
          <Description>This page could not be found</Description>
          <Glow src="/images/glow-404.png" />
        </Content>
      </Container>
      <Footer />
    </>
  );
};
