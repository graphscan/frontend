import { Container, Text, Anchor, Footer, Robot, ColoredText, LeftSection } from './help.styled';
import { preventDefault } from '../../../../../utils/events.utils';

export const Help: React.FC = () => {
  return (
    <Container>
      <Text>
        Welcome to Graphscan - the open-source analytic service based on The Graph protocol. Graphscan
        provides detailed statistics and analytics for The Graph protocol, including statistics for Indexers,
        Delegators, and Curators. Additionally, Graphscan features comprehensive statistics on Subgraphs
        within The Graph protocol across different networks.
      </Text>
      <LeftSection>
        <Text>
          The Graph protocol is a decentralized indexing and querying protocol for blockchain data, and
          Graphscan offers unparalleled insight and analysis into its inner workings. By leveraging subgraphs
          within The Graph protocol, Graphscan enables you to compare the efficiency of Indexers, examine
          Indexers' strategies for working with allocations, and learn from other network participants'
          strategies. Curators and Delegators can also use Graphscan to determine their profitability.
        </Text>
        <Text>
          Graphscan's code is open-source and available at{' '}
          <Anchor
            onMouseDown={preventDefault}
            target="_blank"
            rel="noreferrer"
            href="https://github.com/orgs/graphscan"
          >
            https://github.com/orgs/graphscan
          </Anchor>
          . <br /> Graphscan exists thanks to a grant from The Graph Foundation and is technically partnered
          with indexer{' '}
          <Anchor
            onMouseDown={preventDefault}
            target="_blank"
            rel="noreferrer"
            href="https://graphscan.io/profile?id=0x9238584c74e5fa445a8f72a4d4ef4699dd783852#indexer-details"
          >
            Ryabina
          </Anchor>
          .
        </Text>
        <Text>Join the community of The Graph protocol users today and explore the power of Graphscan!</Text>
        <Text>
          Get support with a telegram{' '}
          <Anchor onMouseDown={preventDefault} target="_blank" rel="noreferrer" href="https://t.me/graphscan">
            https://t.me/graphscan
          </Anchor>{' '}
          .
        </Text>
      </LeftSection>
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
