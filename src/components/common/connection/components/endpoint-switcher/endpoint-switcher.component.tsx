import { useState, useEffect, useCallback } from 'react';
import { ENDPOINT_STORAGE_KEY } from '../../../../../services/graphql.service';
import { Select } from './endpoint-switcher.styled';

const ENDPOINTS = [
  {
    label: 'local-next',
    value: 'https://node.graphscan.io/subgraphs/name/graphscan-next',
  },
  {
    label: 'local',
    value: 'https://node.graphscan.io/subgraphs/name/graphscan',
  },
  {
    label: 'public',
    value: 'https://api.thegraph.com/subgraphs/name/ryabina-io/graphscan',
  },
];

const createOption = (label: string) => ({ label, value: label });

const changeEndpoint = (endpoint: string) => {
  if (window) {
    sessionStorage.setItem(ENDPOINT_STORAGE_KEY, endpoint);
    location.reload();
  }
};

export const EndpointSwitcher: React.FC = () => {
  const [value, setValue] = useState(ENDPOINTS[0]);
  const [options, setOptions] = useState(ENDPOINTS);

  useEffect(() => {
    if (typeof sessionStorage !== 'undefined') {
      const endpoint = sessionStorage.getItem(ENDPOINT_STORAGE_KEY);
      if (endpoint) {
        const [option] = options.filter((x) => x.value === endpoint);
        if (typeof option !== 'undefined') {
          setValue(option);
        } else {
          const newOption = createOption(endpoint);
          setOptions((prevState) => [...prevState, newOption]);
          setValue(newOption);
        }
      }
    }
  }, [options]);

  const handleChange = useCallback((option: { label: string; value: string } | null) => {
    if (option) {
      changeEndpoint(option.value);
    }
  }, []);

  const handleCreate = useCallback((inputValue: string) => {
    const newOption = createOption(inputValue);
    changeEndpoint(newOption.value);
  }, []);

  return (
    <Select
      value={value}
      options={options}
      onChange={handleChange}
      onCreateOption={handleCreate}
      classNamePrefix="creatable-select"
    />
  );
};
