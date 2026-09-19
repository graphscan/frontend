import { divideBy1e18 } from "./number.utils";

export type IndexerProvision = {
  id: string;
  tokensProvisioned: string;
  tokensThawing: string;
  tokensAllocated: string;
  delegatedTokens: string;
  delegatedThawingTokens: string;
  dataService: { delegationRatio: number | null };
};

// Match HorizonStaking.getTokensAvailable for each service. Idle self stake and
// thawing funds cannot back new allocations; capacity cannot move across services.
export const getIndexerCapacity = (provisions: IndexerProvision[]) => {
  const zero = BigInt(0);
  let capacity = zero;
  let available = zero;
  let excess = zero;
  let remainingDelegation = zero;
  for (const provision of provisions) {
    const self =
      BigInt(provision.tokensProvisioned) - BigInt(provision.tokensThawing);
    const delegated =
      BigInt(provision.delegatedTokens) -
      BigInt(provision.delegatedThawingTokens);
    const allocated = BigInt(provision.tokensAllocated);
    const ratio = provision.dataService.delegationRatio;
    // Unknown service parameters must not silently inherit the old 16x limit.
    if (
      ratio === null &&
      (self > zero || delegated > zero || allocated > zero)
    ) {
      return {
        allocationCapacity: null,
        availableToAllocate: null,
        allocationsAboveCapacity: null,
        delegationRemaining: null,
      };
    }
    const delegationLimit = self * BigInt(ratio ?? 0);
    const poolCapacity =
      self + (delegated < delegationLimit ? delegated : delegationLimit);
    const balance = poolCapacity - allocated;
    capacity += poolCapacity;
    available += balance > zero ? balance : zero;
    excess += balance < zero ? -balance : zero;
    remainingDelegation += delegationLimit - delegated;
  }
  return {
    allocationCapacity: divideBy1e18(capacity.toString()),
    availableToAllocate: divideBy1e18(available.toString()),
    allocationsAboveCapacity: divideBy1e18(excess.toString()),
    delegationRemaining: divideBy1e18(remainingDelegation.toString()),
  };
};
