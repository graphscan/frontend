import { createElement, useCallback, useState } from "react";
import { AllocationRewardsButton } from "./components/allocation-rewards-button/allocation-rewards-button.component";
import {
  AllocationsRewards,
  PotentialRewards,
} from "../../model/allocation-rewards.model";

export const useAllocationsRewards = () => {
  const [allocationsRewards, setAllocationsRewards] =
    useState<AllocationsRewards>({});

  const onRewardsReceived = useCallback(
    (id: string, potentialRewards: PotentialRewards) => {
      setAllocationsRewards((prevState) => {
        return { ...prevState, [id]: potentialRewards };
      });
    },
    [],
  );

  const renderRewardsButton = useCallback(
    (
      allocationId: string,
      potentialIndexingRewardCut: number,
      rewardsIssuer?: string,
    ) =>
      createElement(AllocationRewardsButton, {
        allocationId,
        potentialIndexingRewardCut,
        rewardsIssuer,
        onSuccess: onRewardsReceived,
      }),
    [onRewardsReceived],
  );

  return {
    allocationsRewards,
    renderRewardsButton,
  };
};
