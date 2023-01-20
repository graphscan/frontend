import { useQuery } from '@tanstack/react-query';
import { Rewards } from './allocation-rewards-button.icons';
import { getAllocationRewards } from './allocation-rewards-button.service';
import { StyledAllocationRewardsButton, LoaderContainer } from './allocation-rewards-button.styled';
import { Spinner } from '../../../../components/common/spinner/spinner.component';
import { PotentialRewards } from '../../../../model/allocation-rewards.model';
import { preventDefault } from '../../../events.utils';

type Props = {
  allocationId: string;
  potentialIndexingRewardCut: number;
  onSuccess: (allocationId: string, potentialRewards: PotentialRewards) => void;
};

export const AllocationRewardsButton: React.FC<Props> = ({
  allocationId,
  potentialIndexingRewardCut,
  onSuccess,
}) => {
  const { isFetching, refetch } = useQuery<PotentialRewards>(
    ['allocation-rewards', allocationId, potentialIndexingRewardCut],
    () => getAllocationRewards(allocationId, potentialIndexingRewardCut),
    { enabled: false, onSuccess: (data) => onSuccess(allocationId, data) },
  );

  return isFetching ? (
    <LoaderContainer>
      <Spinner />
    </LoaderContainer>
  ) : (
    <StyledAllocationRewardsButton onClick={() => refetch()} onMouseDown={preventDefault}>
      <Rewards />
    </StyledAllocationRewardsButton>
  );
};
