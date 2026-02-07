import { useQuery } from "@tanstack/react-query";
import { Rewards } from "./allocation-rewards-button.icons";
import { getAllocationRewards } from "./allocation-rewards-button.service";
import {
  StyledAllocationRewardsButton,
  LoaderContainer,
} from "./allocation-rewards-button.styled";
import { Spinner } from "../../../../components/common/spinner/spinner.component";
import { PotentialRewards } from "../../../../model/allocation-rewards.model";
import { preventDefault } from "../../../events.utils";

const LEGACY_DATA_SERVICE_ADDRESS =
  "0x00669A4CF01450B64E8A2A20E9b1FCB71E61eF03";

type Props = {
  allocationId: string;
  potentialIndexingRewardCut: number;
  rewardsIssuer?: string;
  onSuccess: (allocationId: string, potentialRewards: PotentialRewards) => void;
};

export const AllocationRewardsButton: React.FC<Props> = ({
  allocationId,
  potentialIndexingRewardCut,
  rewardsIssuer = LEGACY_DATA_SERVICE_ADDRESS,
  onSuccess,
}) => {
  const { isFetching, refetch } = useQuery<PotentialRewards>(
    [
      "allocation-rewards",
      allocationId,
      potentialIndexingRewardCut,
      rewardsIssuer,
    ],
    () =>
      getAllocationRewards(
        allocationId,
        potentialIndexingRewardCut,
        rewardsIssuer,
      ),
    { enabled: false, onSuccess: (data) => onSuccess(allocationId, data) },
  );

  return isFetching ? (
    <LoaderContainer>
      <Spinner />
    </LoaderContainer>
  ) : (
    <StyledAllocationRewardsButton
      onClick={() => refetch()}
      onMouseDown={preventDefault}
    >
      <Rewards />
    </StyledAllocationRewardsButton>
  );
};
