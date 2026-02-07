import React, { useContext } from "react";
import { DownloadButton } from "./download-button/download-button.component";
import { Pagination } from "./pagination/pagination.component";
import { DocsLinks } from "../../docs-links/docs-links.component";
import { PaginationOptions } from "../../../../model/pagination.model";
import { DownloadButtonOptions } from "../../../../model/download-button.model";
import { useTooltip } from "../../../../utils/tooltip.utils";
import {
  Wrapper,
  Container,
  LeftSide,
  Result,
  PaginationContainer,
  DownloadButtonContainer,
} from "./table-footer.styled";

type Props = {
  downloadCsvOptions: DownloadButtonOptions;
  hasData: boolean;
  paginationOptions: PaginationOptions;
};

const PaginationContext = React.createContext<PaginationOptions | undefined>(
  undefined,
);

export const usePaginationContext = () => {
  const context = useContext(PaginationContext);

  if (typeof context === "undefined") {
    throw new Error(
      "usePaginationContext must be used within PaginationContext",
    );
  }

  return context;
};

export const TableFooter: React.FC<Props> = ({
  downloadCsvOptions,
  hasData,
  paginationOptions,
  paginationOptions: { total },
}) => {
  useTooltip();

  return (
    <Wrapper>
      <Container $isLogoOnly={!hasData}>
        {hasData && (
          <>
            <LeftSide>
              <Result>
                {total} result{total !== 1 && "s"}
              </Result>
              <DownloadButtonContainer data-tip="Download data as CSV.">
                <DownloadButton {...downloadCsvOptions} />
              </DownloadButtonContainer>
            </LeftSide>
            <PaginationContainer>
              <PaginationContext.Provider value={paginationOptions}>
                <Pagination />
              </PaginationContext.Provider>
            </PaginationContainer>
          </>
        )}
        <DocsLinks />
      </Container>
    </Wrapper>
  );
};
