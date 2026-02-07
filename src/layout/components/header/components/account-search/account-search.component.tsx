import { useState, useEffect, useRef, ChangeEvent } from "react";
import Link from "next/link";
import { useAccountsSearch } from "./account-search.service";
import {
  Wrapper,
  InputContainer,
  StyledInput,
  Button,
  CleanButtonContainer,
  SearchResults,
  AccountLink,
  LockContracts,
  LockContractLink,
} from "./account-search.styled";
import { Spinner } from "../../../../../components/common/spinner/spinner.component";
import { useControlledInput } from "../../../../../utils/input.utils";

type Props = {
  placeholder: string;
};

export const AccountSearch: React.FC<Props> = ({ placeholder }) => {
  const { currentValue, setCurrentValue, CleanInputButton } =
    useControlledInput();
  const [isFocused, setIsFocused] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, isFetching } = useAccountsSearch(currentValue);

  const searchResults = data ?? [];

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => setIsFocused(false);

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (
        e.target !== ref.current &&
        e.target instanceof Node &&
        !ref.current?.contains(e.target)
      ) {
        inputRef.current?.blur();
        handleBlur();
      }
    });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (!/(^[-_a-zA-Z0-9]+$|^$)/.test(input)) {
      return;
    }

    setCurrentValue(e.target.value);
  };

  return (
    <Wrapper ref={ref}>
      <InputContainer
        $focused={isFocused}
        $hasResults={searchResults.length > 0}
      >
        <StyledInput
          ref={inputRef}
          value={currentValue}
          onChange={handleChange}
          placeholder={placeholder}
          onFocus={handleFocus}
        />
        <CleanButtonContainer>{CleanInputButton}</CleanButtonContainer>
        <Button>
          {isFetching ? (
            <Spinner />
          ) : (
            <img src="/images/search.svg" alt="Search icon" />
          )}
        </Button>
      </InputContainer>
      {isFocused && searchResults.length > 0 && (
        <SearchResults>
          {searchResults.map(({ id, defaultDisplayName, tokenLockWallets }) => (
            <li key={id} onClick={handleBlur}>
              <Link
                href={{ pathname: "/profile", query: { id } }}
                passHref
                legacyBehavior
              >
                <AccountLink onClick={() => setCurrentValue("")}>
                  {defaultDisplayName ?? id}
                </AccountLink>
              </Link>
              {tokenLockWallets.length > 0 && (
                <LockContracts>
                  {tokenLockWallets.map(({ id: lockId }) => (
                    <li key={lockId} onClick={handleBlur}>
                      <Link
                        href={{ pathname: "/profile", query: { id: lockId } }}
                        passHref
                        legacyBehavior
                      >
                        <LockContractLink onClick={() => setCurrentValue("")}>
                          {lockId}
                        </LockContractLink>
                      </Link>
                    </li>
                  ))}
                </LockContracts>
              )}
            </li>
          ))}
        </SearchResults>
      )}
    </Wrapper>
  );
};
