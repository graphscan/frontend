import { useState, useRef, useCallback } from "react";
import { Row, Col } from "antd";
import { transformToStats } from "./network-stats.model";
import { Modal, Styles, Preloader } from "./network-stats.styled";
import { renderDailyIssuanceTooltip } from "./network-stats.utils";
import { ProtocolContracts } from "./protocol-contracts/protocol-contracts.component";
import { Spinner } from "../../../common/spinner/spinner.component";
import { DISCARDED_CURATORS_COUNT } from "../../../../model/curators.model";
import { useNetworkStats } from "../../../../services/network-stats.service";
import { preventDefault } from "../../../../utils/events.utils";
import { formatNumber } from "../../../../utils/number.utils";
import {
  useTooltip,
  tooltipNumberContent,
} from "../../../../utils/tooltip.utils";

export const NetworkStats: React.FC = () => {
  useTooltip();

  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [height, setHeight] = useState<string>("0px");
  const [showModal, setShowModal] = useState(false);

  const { data, error, isLoading } = useNetworkStats();

  const ref = useRef<HTMLDivElement>(null);

  const toggleModal = useCallback(() => {
    setShowModal((prevState) => !prevState);
  }, [setShowModal]);

  const toggleStats = useCallback(() => {
    setIsOpened((prevState) => {
      setHeight(prevState ? "0px" : `${ref.current?.scrollHeight}px`);

      return !prevState;
    });
  }, []);

  if (isLoading) {
    return (
      <Preloader>
        <Spinner />
      </Preloader>
    );
  }

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return (
      <Preloader>
        <img src="/images/no-data.svg" alt="No data image" />
      </Preloader>
    );
  }

  if (!data) {
    return null;
  }

  const {
    totalSupply,
    totalGRTMinted,
    totalGRTBurned,
    dailyIssuance,
    maxDailyIssuance,
    totalTokensStaked,
    totalDelegatedTokens,
    totalTokensAllocated,
    totalTokensSignalled,
    indexerCount,
    delegatorCount,
    subgraphCount,
    curatorCount,
    totalIndexingRewards,
    totalIndexingDelegatorRewards,
    totalIndexingIndexerRewards,
    totalQueryFees,
    currentEpoch,
    ...protocolContracts
  } = transformToStats(data);

  return (
    <Styles>
      <Row
        className={`network-stats__header${!isOpened ? " network-stats__header_closed" : ""}`}
        align="middle"
        onClick={toggleStats}
        onKeyDown={(e) => e.key === "Enter" && toggleStats()}
        tabIndex={0}
        onMouseDown={preventDefault}
      >
        <Col
          className="network-stats__cell network-stats__cell_type_header"
          span={6}
        >
          <div className="network-stats__header-cell-content">
            <span className="network-stats__header-cell-title">
              Total supply
            </span>
            <span data-tip={tooltipNumberContent(totalSupply)}>
              {formatNumber(totalSupply)}
            </span>
            &nbsp;
            <span className="network-stats__grt">GRT</span>
          </div>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_header"
          span={6}
        >
          <div className="network-stats__header-cell-content">
            <span className="network-stats__header-cell-title">
              Stake total
            </span>
            <span
              data-tip={tooltipNumberContent(
                totalTokensStaked + totalDelegatedTokens,
              )}
            >
              {formatNumber(totalTokensStaked + totalDelegatedTokens)}
            </span>
            &nbsp;
            <span className="network-stats__grt">GRT</span>
          </div>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_header"
          span={6}
        >
          <div className="network-stats__header-cell-content">
            <span className="network-stats__header-cell-title">
              Indexing Rewards
            </span>
            <span data-tip={tooltipNumberContent(totalIndexingRewards)}>
              {formatNumber(totalIndexingRewards)}
            </span>
            &nbsp;
            <span className="network-stats__grt">GRT</span>
          </div>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_header"
          span={6}
        >
          <div className="network-stats__header-cell-content">
            <span className="network-stats__header-cell-title">Delegators</span>
            <span>{delegatorCount}</span>
          </div>
        </Col>
        <span
          className={`network-stats__expand-icon ${isOpened ? "network-stats__expand-icon_reverted" : ""}`}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="11" cy="11" r="11" fill="#3b5170" />
            <path
              d="M11 14L7 10"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M11 14L15 10"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </Row>

      <Row
        align="middle"
        className={`network-stats__body${!isOpened ? " network-stats__body_closed" : ""}`}
        style={{ height, overflow: "hidden", transition: "height 0.5s" }}
        ref={ref}
      >
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span className="network-stats__body-cell-title">Minted</span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span data-tip={tooltipNumberContent(totalGRTMinted)}>
            {formatNumber(totalGRTMinted)}
          </span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span className="network-stats__body-cell-title">Indexers stake</span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span data-tip={tooltipNumberContent(totalTokensStaked)}>
            {formatNumber(totalTokensStaked)}
          </span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span className="network-stats__body-cell-title">
            Indexers Rewards
          </span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span data-tip={tooltipNumberContent(totalIndexingIndexerRewards)}>
            {formatNumber(totalIndexingIndexerRewards)}
          </span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span className="network-stats__body-cell-title">Subgraphs</span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span>{subgraphCount}</span>
        </Col>

        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span className="network-stats__body-cell-title">Burned</span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span data-tip={tooltipNumberContent(totalGRTBurned)}>
            {formatNumber(totalGRTBurned)}
          </span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span className="network-stats__body-cell-title">
            Delegated stake
          </span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span data-tip={tooltipNumberContent(totalDelegatedTokens)}>
            {formatNumber(totalDelegatedTokens)}
          </span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span className="network-stats__body-cell-title">
            Delegators rewards
          </span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span data-tip={tooltipNumberContent(totalIndexingDelegatorRewards)}>
            {formatNumber(totalIndexingDelegatorRewards)}
          </span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span className="network-stats__body-cell-title">Indexers</span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span>{indexerCount}</span>
        </Col>

        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span className="network-stats__body-cell-title">Daily issuance</span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span
            data-html
            data-tip={renderDailyIssuanceTooltip({
              dailyIssuance,
              maxDailyIssuance,
            })}
          >
            {formatNumber(dailyIssuance)}
          </span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span className="network-stats__body-cell-title">
            Allocated stake
          </span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span data-tip={tooltipNumberContent(totalTokensAllocated)}>
            {formatNumber(totalTokensAllocated)}
          </span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span className="network-stats__body-cell-title">Query fees</span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span data-tip={tooltipNumberContent(totalQueryFees)}>
            {formatNumber(totalQueryFees)}
          </span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span className="network-stats__body-cell-title">Curators</span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span>{curatorCount - DISCARDED_CURATORS_COUNT}</span>
        </Col>

        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span className="network-stats__body-cell-title">Current Epoch</span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span>{currentEpoch}</span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span className="network-stats__body-cell-title">Signaled total</span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span data-tip={tooltipNumberContent(totalTokensSignalled)}>
            {formatNumber(totalTokensSignalled)}
          </span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span className="network-stats__body-cell-title">
            Curators rewards
          </span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={3}
        >
          <span data-tip={tooltipNumberContent(totalQueryFees / 10)}>
            {formatNumber(totalQueryFees / 10)}
          </span>
        </Col>
        <Col
          className="network-stats__cell network-stats__cell_type_body"
          span={6}
        >
          <button
            onMouseDown={preventDefault}
            onClick={toggleModal}
            className="network-stats__button"
          >
            Protocol contracts
          </button>
        </Col>
      </Row>
      <Modal
        title="Protocol contracts"
        isVisible={showModal}
        onCancel={toggleModal}
      >
        <ProtocolContracts {...protocolContracts} />
      </Modal>
    </Styles>
  );
};
