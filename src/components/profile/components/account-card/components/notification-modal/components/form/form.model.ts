import { AddressViewModel } from "./view-models/address.view-model";
import { NumberViewModel } from "./view-models/number.view-model";

type InputViewModels = {
  address: AddressViewModel;
  number: NumberViewModel;
};

export type InputType = keyof InputViewModels;

type InputDictValue<T extends InputType> = {
  name: string;
  type: T;
  model: InputViewModels[T];
};

type InputsDict = {
  [T in InputType]: InputDictValue<T>;
};

export type Input = InputsDict[InputType];

export type Topic = {
  name: string;
  title: string;
  description: string;
  values: Array<{
    name: string;
    type: InputType;
    label: string;
    initialValue?: string;
  }> | null;
  checked: boolean;
};

export const indexerTopics: Array<Topic> = [
  {
    name: "stake-delegated",
    title: "Indexer has received a new delegation",
    description:
      "The indexer has received a new delegation of specified minimum size or larger.",
    values: [
      { name: "indexer", type: "address", label: "Indexer address" },
      {
        name: "minDelegated",
        type: "number",
        label: "Min. size of delegation in GRT",
        initialValue: "1000",
      },
    ],
    checked: false,
  },
  {
    name: "stake-undelegated",
    title: "The Indexer has lost a delegation",
    description:
      "The indexer has lost a delegation of specified minimum size or larger.",
    values: [
      { name: "indexer", type: "address", label: "Indexer address" },
      {
        name: "minUndelegated",
        type: "number",
        label: "Min. size of delegation in GRT",
        initialValue: "1000",
      },
    ],
    checked: false,
  },
  {
    name: "allocation-duration",
    title: "One of the allocations is older than X days",
    description:
      "One of the indexer's allocations exceeded designated time period.",
    values: [
      { name: "indexer", type: "address", label: "Indexer address" },
      { name: "days", type: "number", label: "Days", initialValue: "26" },
    ],
    checked: false,
  },
  {
    name: "subgraph-denied-changed",
    title: "The indexer's allocated subgraph is now DENIED",
    description: `
      Indexers do not receive rewards for allocating to denied subgraphs,
      so it is recommended to reallocate once your receive such alert.
    `,
    values: [{ name: "indexer", type: "address", label: "Indexer address" }],
    checked: false,
  },
  {
    name: "allocation-proportion-changed",
    title: "One of the allocations has low rewards proportion",
    description: `
      One of the allocations has low rewards proportion.
      Reward proportion is an index indicating the profitability of the subgraph for indexers.
      1 means average profitability. The higher the value, the more profitable the subgraph is for indexers.
      Rewards Proportion is the division of the ratio of subgraph signals to the total value of signals by the
      ratio of subgraph allocations to the total value of allocations.
    `,
    values: [
      { name: "indexer", type: "address", label: "Indexer address" },
      {
        name: "minProportion",
        type: "number",
        label: "Min. rewards proportion value (1=average)",
        initialValue: "0.8",
      },
    ],
    checked: false,
  },
  {
    name: "subgraph-stats",
    title: "A subgraph with a high rewards proportion appeared",
    description: `
      A subgraph with high rewards proportion and minimum requested amount of signals has appeared.
      Reward proportion is an index indicating the profitability of the subgraph for indexers.
      1 means average profitability. The higher the value, the more profitable the subgraph is for indexers.
      Rewards Proportion is the division of the ratio of subgraph signals to the total value of signals by the
      ratio of subgraph allocations to the total value of allocations.
    `,
    values: [
      {
        name: "minSignalled",
        type: "number",
        label: "Min. amount of signalled GRT",
        initialValue: "10000",
      },
      {
        name: "goodProportion",
        type: "number",
        label: "Min. reward proportion value (1=average)",
        initialValue: "1.5",
      },
    ],
    checked: false,
  },
  {
    name: "current-gas-price",
    title: "Gas price is lower than X",
    description:
      "An alert will come each time gas price goes from value above threshold to a value below threshold.",
    values: [
      {
        name: "maxGasPrice",
        type: "number",
        label: "Gas price",
        initialValue: "10",
      },
    ],
    checked: false,
  },
  {
    name: "new-epoch",
    title: "New epoch has begun",
    description: "The alert will come every epoch.",
    values: null,
    checked: false,
  },
];

export const indexerTopicsL2 = indexerTopics.filter(
  ({ name }) => name !== "current-gas-price",
);

export const delegatorTopics: Array<Topic> = [
  {
    name: "delegator-epoch-rewards",
    title: "Changes of your stake over the last epoch",
    description: `
      If your indexer closed allocations in the last epoch and you received rewards,
      we will send you a summary.
    `,
    values: [
      { name: "delegator", type: "address", label: "Delegator address" },
    ],
    checked: false,
  },
  {
    name: "withdraw-possibility-changed",
    title: "Unstaked GRT can be withdrawn (28 days after unstake)",
    description: `
      The alert will come once when a desired address has some unbonded tokens ready to be withdrawn,
      which happens 28 days after they are unstaked.
    `,
    values: [
      { name: "delegator", type: "address", label: "Delegator address" },
    ],
    checked: false,
  },
  {
    name: "effective-reward-cut-changed",
    title: "The effective reward cut of your indexer has become more than X%",
    description: `
      The alert will come when the effective reward cut of your indexer has become more than X%.
    `,
    values: [
      { name: "delegator", type: "address", label: "Delegator address" },
      {
        name: "minEffectiveCut",
        type: "number",
        label: "Effective reward cut, %",
        initialValue: "20",
      },
    ],
    checked: false,
  },
];
