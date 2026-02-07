import { makeAutoObservable } from "mobx";
import {
  Topic,
  delegatorTopics,
  indexerTopics,
  indexerTopicsL2,
} from "./form.model";
import { AddressViewModel } from "./view-models/address.view-model";
import { NumberViewModel } from "./view-models/number.view-model";
import { getEnvVariables } from "../../../../../../../../utils/env.utils";

type TopicUi = Topic & { inputs: Array<NumberViewModel> | null };

const topicsMapper = (topic: Topic): TopicUi => {
  const { values } = topic;
  if (Array.isArray(values)) {
    const inputs = values.flatMap(({ name, type, label, initialValue }) =>
      type === "number"
        ? new NumberViewModel(name, label, { initialValue })
        : [],
    );

    return {
      ...topic,
      inputs,
    };
  }

  return { ...topic, inputs: null };
};

const topicsTypes = ["indexer", "delegator"] as const;

type TopicsType = (typeof topicsTypes)[number];

export const isTopicsType = (type: unknown): type is TopicsType =>
  topicsTypes.some((t) => t === type);

export class FormViewModel {
  topicsMap: Record<TopicsType, Array<TopicUi>> = {
    indexer: indexerTopicsL2.map(topicsMapper),
    delegator: delegatorTopics.map(topicsMapper),
  };
  topicsType: TopicsType | undefined;
  addressModel: AddressViewModel;

  constructor(id: string, topicsType: string | undefined) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.addressModel = new AddressViewModel({ initialValue: id });

    if (isTopicsType(topicsType)) {
      this.topicsType = topicsType;
    }
  }

  get isValid() {
    return (
      this.selectedTopics.length > 0 &&
      this.selectedTopics.every(({ inputs }) =>
        inputs ? inputs.every(({ isValid }) => isValid) : true,
      ) &&
      (this.addressInput ? this.addressModel.isValid : true)
    );
  }

  get topics() {
    return this.topicsType ? this.topicsMap[this.topicsType] : [];
  }

  get redirectOptions() {
    const entries = this.selectedTopics.flatMap(({ inputs }) =>
      inputs
        ? inputs.map<[string, string | number]>(({ id, payload }) => [
            id,
            payload,
          ])
        : [],
    );

    if (this.addressInput) {
      entries.push([this.addressInput.name, this.addressModel.payload]);
    }

    return Buffer.from(
      JSON.stringify({
        template: {
          values: Object.fromEntries(entries),
          topics: this.selectedTopics.map(({ name }) => name),
        },
      }),
    ).toString("base64");
  }

  get selectedTopics() {
    return this.topics.filter(({ checked }) => checked);
  }

  get addressInput() {
    const topic = this.selectedTopics.find(({ values }) =>
      values?.some(({ type }) => type === "address"),
    );

    if (topic && topic.values) {
      return topic.values.find(({ type }) => type === "address");
    }
  }

  setTopicsType(topicsType: TopicsType) {
    this.topicsType = topicsType;
  }

  updateCheckboxes(name: string) {
    const topic = this.topics.find((topic) => topic.name === name);

    if (topic) {
      topic.checked = !topic.checked;
    }
  }
}
