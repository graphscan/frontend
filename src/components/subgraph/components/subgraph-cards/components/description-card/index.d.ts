declare module 'react-truncate' {
  export interface TruncateProps {
    lines?: number | false;
    ellipsis?: React.ReactNode;
    trimWhitespace?: boolean;
    onTruncate?(isTruncated: boolean): void;
  }

  class Truncate extends React.Component<TruncateProps> {
    onResize: () => void;
  }

  export default Truncate;
}
