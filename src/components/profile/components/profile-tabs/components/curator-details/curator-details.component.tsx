import { useCuratorDetails } from "./curator-details.service";
import { Empty } from "../../../../../common/empty/empty.component";
import {
  DetailsContainerWithPad,
  ContainerPad,
  TablePad,
  Table,
  Tr,
  Th,
  Td,
  Postfix,
} from "../../../../../common/details/details.styled";
import { Footer } from "../../../../../common/footer/footer.component";
import { TabPreloader } from "../../../../../common/tab-preloader/tab-preloader.component";
import { formatNumber } from "../../../../../../utils/number.utils";
import { createTitleWithTooltipDescription } from "../../../../../../utils/table.utils";
import {
  useTooltip,
  tooltipNumberContent,
} from "../../../../../../utils/tooltip.utils";

type Props = {
  id: string;
};

export const CuratorDetails: React.FC<Props> = ({ id }) => {
  useTooltip();

  const { data, error, isLoading } = useCuratorDetails(id);

  if (isLoading) {
    return <TabPreloader />;
  }

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return <Empty />;
  }

  if (!data) {
    return null;
  }

  const {
    subgraphsCount,
    currentSignaledGRT,
    signaledTotal,
    unsignaledTotal,
    PLGrt,
  } = data;

  return (
    <>
      <ContainerPad>
        <DetailsContainerWithPad>
          <TablePad>
            <Table>
              <tbody>
                <Tr>
                  <Th>
                    {createTitleWithTooltipDescription(
                      "Subgraphs count",
                      "Current number of signaled subgraphs.",
                    )}
                  </Th>
                  <Td>
                    <span data-tip={tooltipNumberContent(subgraphsCount)}>
                      {formatNumber(subgraphsCount, 0)}
                    </span>
                  </Td>
                </Tr>
                <Tr>
                  <Th>
                    {createTitleWithTooltipDescription(
                      "Potential Signals Value",
                      "Amount of GRT that can be received by Curator if unsignal from all his subgraphs.",
                    )}
                  </Th>
                  <Td>
                    <span data-tip={tooltipNumberContent(currentSignaledGRT)}>
                      {formatNumber(currentSignaledGRT)}
                    </span>
                    <Postfix> GRT</Postfix>
                  </Td>
                </Tr>
                <Tr>
                  <Th>
                    {createTitleWithTooltipDescription(
                      "Signaled Total",
                      "All-time amount of GRT spent on signaling.",
                    )}
                  </Th>
                  <Td>
                    <span data-tip={tooltipNumberContent(signaledTotal)}>
                      {formatNumber(signaledTotal)}
                    </span>
                    <Postfix> GRT</Postfix>
                  </Td>
                </Tr>
                <Tr>
                  <Th>
                    {createTitleWithTooltipDescription(
                      "Unsignaled Total",
                      "All-time amount of GRT received from unsignaling.",
                    )}
                  </Th>
                  <Td>
                    <span data-tip={tooltipNumberContent(unsignaledTotal)}>
                      {formatNumber(unsignaledTotal)}
                    </span>
                    <Postfix> GRT</Postfix>
                  </Td>
                </Tr>
              </tbody>
            </Table>
          </TablePad>
          <TablePad>
            <Table>
              <tbody>
                <Tr>
                  <Th>
                    {createTitleWithTooltipDescription(
                      "P/L GRT",
                      "Unsignaled Total + Potential Signals Value - Signaled Total.",
                    )}
                  </Th>
                  <Td>
                    <span
                      data-tip={tooltipNumberContent(PLGrt)}
                      data-text-color={
                        PLGrt > 0 ? "#4cd08e" : PLGrt < 0 ? "#e25776" : ""
                      }
                      style={{
                        color:
                          PLGrt > 0 ? "#4cd08e" : PLGrt < 0 ? "#e25776" : "",
                      }}
                    >
                      {formatNumber(PLGrt)}
                    </span>
                    <Postfix> GRT</Postfix>
                  </Td>
                </Tr>
              </tbody>
            </Table>
          </TablePad>
        </DetailsContainerWithPad>
      </ContainerPad>
      <Footer />
    </>
  );
};
