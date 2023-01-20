import {
  Container,
  Title,
  TitleLink,
  ArrowIconContainer,
  GraphIconContainer,
  Text,
  Anchor,
  Info,
  ListContainer,
  ListItem,
  Heading,
  ColoredText,
  Footer,
  Robot,
} from './help.styled';
import { Graph, Arrow } from './help.icons';
import { preventDefault } from '../../../../../utils/events.utils';

export const Help: React.FC = () => {
  return (
    <Container>
      <Title>
        <TitleLink onMouseDown={preventDefault} href="https://thegraph.com/" target="_blank" rel="noreferrer">
          <GraphIconContainer>
            <Graph />
          </GraphIconContainer>
          <span>The Graph</span>
          <ArrowIconContainer>
            <Arrow />
          </ArrowIconContainer>
        </TitleLink>
      </Title>
      <Text>
        Is a decentralized protocol that enables the indexing and querying of data via Subgraphs. The Graph
        optimizes data acquisition from any supported source, making it possible to efficiently query
        blockchain data without relying on a centralized service provider.{' '}
        <Anchor
          onMouseDown={preventDefault}
          href="https://thegraph.com/docs"
          target="_blank"
          rel="noreferrer"
        >
          Know more
        </Anchor>
      </Text>
      <Text>
        There are several actors in The Graph Network, which interact with Subgraphs:
        <br />
        Indexers, Delegators, and Curators. With the Graphscan you can:
      </Text>
      <Info>
        <ListContainer>
          <ul>
            <ListItem>Compare Indexers by APR, effective/reward cut, stake size, etc;</ListItem>
            <ListItem>Consider Indexers’ strategies and allocation periodicity;</ListItem>
            <ListItem>Explore other network actors’ strategies;</ListItem>
            <ListItem>Find out your profitability as Curator and Delegator.</ListItem>
          </ul>
        </ListContainer>
        <Heading>Statistics for each actor can be found</Heading>
        <ColoredText>in the corresponding tab.</ColoredText>
        <Heading>Use calculator</Heading>
        <ColoredText>
          to estimate the profitability of your future delegation based on its size and to choose an
          appropriate Indexer.
        </ColoredText>
      </Info>
      <Footer>
        <Robot>
          <img src="/images/robot.png" alt="Robot" />
        </Robot>
        <ColoredText>
          Robots lovingly delivered by{' '}
          <Anchor onMouseDown={preventDefault} href="https://robohash.org/" target="_blank" rel="noreferrer">
            Robohash.org
          </Anchor>
        </ColoredText>
      </Footer>
    </Container>
  );
};
