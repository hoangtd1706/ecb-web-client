import React from 'react';

import {
  ComboBox,
} from '@nvdunginest/emis-mui';

import serviceMasterService, {
  ServiceMasterModel,
} from '../services/serviceMaster';

type ComboBoxType = ServiceMasterModel & {
  label: string;
}

type Props = {
  value: ServiceMasterModel | null;
  onChange: (value: ServiceMasterModel) => void;
}

const SERVICE_MASTER_CODE_KEY = 'SERVICE_MASTER_CODE_KEY';
const SERVICE_MASTER_DESCRIPTION_KEY = 'SERVICE_MASTER_DESCRIPTION_KEY';
const SERVICE_MASTER_UNIT_KEY = 'SERVICE_MASTER_UNIT_KEY';

const renderComboBoxOptions = (serviceMasters: ServiceMasterModel[]): ComboBoxType[] => {
  return serviceMasters.map(x => {
    const result: ComboBoxType = {
      ...x,
      label: `[${x.code}]-${x.description}`,
    }

    return result;
  })
}

const getCache = (): ComboBoxType | null => {
  const code = localStorage.getItem(SERVICE_MASTER_CODE_KEY);
  const description = localStorage.getItem(SERVICE_MASTER_DESCRIPTION_KEY);
  const unit = localStorage.getItem(SERVICE_MASTER_UNIT_KEY);
  if (code === null || description === null || unit === null) {
    return null;
  }
  else {
    return {
      code: code,
      label: `[${code}]-${description}`,
      description: description,
      unit: unit,
    };
  }
}

const setCache = (serviceMaster: ComboBoxType) => {
  localStorage.setItem(SERVICE_MASTER_CODE_KEY, serviceMaster.code);
  localStorage.setItem(SERVICE_MASTER_DESCRIPTION_KEY, serviceMaster.description);
  localStorage.setItem(SERVICE_MASTER_UNIT_KEY, serviceMaster.unit);
}

export default function ServiceMastersComboBox({
  value,
  onChange,
}: Props): JSX.Element {

  const [data, setData] = React.useState<ServiceMasterModel[]>([]);

  const getData = async () => {
    try {
      setData(await serviceMasterService.getAll());
    }
    catch {
      setData([]);
    }
  }

  const handleChange = (value: ComboBoxType | null) => {
    if (value !== null) {
      onChange({
        code: value.code,
        description: value.description,
        unit: value.unit,
      });
      setCache(value);
    }
  }

  React.useEffect(() => {
    const cache = getCache();
    if (cache !== null) {
      onChange({
        code: cache.code,
        description: cache.description,
        unit: cache.unit,
      });
    }
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ComboBox
      required
      label="Công tác"
      options={renderComboBoxOptions(data)}
      optionLabel="label"
      value={value !== null ? {
        code: value.code,
        label: `[${value.code}]-${value.description}`,
        description: value.description,
        unit: value.unit,
      } : null}
      getOptionSelected={(o, v) => o.code === v.code}
      onChange={handleChange}
    />
  );
}
