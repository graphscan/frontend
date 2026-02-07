import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { FormViewModel, isTopicsType } from "./form.view-model";
import { StyledForm, RedText, Select } from "./form.styled";
import { Checkbox } from "./components/checkbox/checkbox.component";
import { Input } from "./components/input/input.component";
import { profileTabsViewModel } from "../../../../../profile-tabs/profile-tabs.model";
import { clampMiddle } from "../../../../../../../../utils/text.utils";

const optionsMap = {
  delegator: { value: "delegator", label: "delegator" },
  indexer: { value: "indexer", label: "indexer" },
  curator: { value: "curator", label: "curator" },
  "subgraph-owner": null,
};

export type FormProps = {
  id: string;
  isDelegator: boolean;
  isIndexer: boolean;
};

type Props = FormProps & {
  setIsValid: (isValid: boolean) => void;
  setRedirectOptions: (redirectOptions: string) => void;
};

export const Form: React.FC<Props> = observer(
  ({ id, isDelegator, isIndexer, setIsValid, setRedirectOptions }) => {
    const { currentAccountType } = profileTabsViewModel;
    const [
      {
        addressModel,
        topics,
        isValid,
        redirectOptions,
        setTopicsType,
        updateCheckboxes,
      },
    ] = useState(() => new FormViewModel(id, currentAccountType));

    const [options, setOptions] = useState<
      Array<{ value: string; label: string }>
    >([]);

    useEffect(() => {
      if (isIndexer) {
        setOptions((prev) => [...prev, optionsMap.indexer]);
      }

      if (isDelegator) {
        setOptions((prev) => [...prev, optionsMap.delegator]);
      }

      return () => setOptions([]);
    }, [isDelegator, isIndexer]);

    useEffect(() => {
      setIsValid(isValid);

      return () => setIsValid(false);
    }, [isValid, setIsValid]);

    useEffect(() => {
      setRedirectOptions(redirectOptions);

      return () => setRedirectOptions("");
    }, [redirectOptions, setRedirectOptions]);

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        updateCheckboxes(e.target.value);
      },
      [updateCheckboxes],
    );

    return (
      <StyledForm>
        <section className="form-controls">
          <div className="form-select-box">
            <label>
              For<RedText>*</RedText>
            </label>
            <Select
              defaultValue={
                typeof currentAccountType === "string"
                  ? optionsMap[currentAccountType]
                  : null
              }
              options={options}
              onChange={(newValue: unknown) => {
                const value = newValue;
                if (isTopicsType(value)) {
                  setTopicsType(value);
                }
              }}
            />
          </div>
          <Input
            placeholder="Address"
            value={clampMiddle(addressModel.value)}
            setValue={addressModel.setValue}
            error={addressModel.error}
            disabled
          />
        </section>
        <section className="form-triggers">
          <h3 className="form-triggers-title">Pick the triggers</h3>
          {topics.map(({ name, title, description, inputs, checked }) => {
            return (
              <fieldset key={name} className="form-fieldset">
                <div>
                  <Checkbox
                    value={name}
                    label={title}
                    description={description}
                    checked={checked}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  {inputs?.map(
                    ({ id, initialValue, label, value, error, setValue }) => {
                      return (
                        checked && (
                          <Input
                            key={id}
                            label={label}
                            placeholder={initialValue}
                            value={value}
                            setValue={setValue}
                            error={error}
                          />
                        )
                      );
                    },
                  )}
                </div>
              </fieldset>
            );
          })}
        </section>
      </StyledForm>
    );
  },
);
