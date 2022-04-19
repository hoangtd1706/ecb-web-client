import React from 'react';

import {
  ComboBox,
} from '@nvdunginest/emis-mui';

import materialService, {
  MaterialModel,
} from '../services/material';

type ComboBoxType = MaterialModel & {
  label: string;
}

type Props = {
  value: MaterialModel | null;
  onChange: (value: MaterialModel) => void;
}

const MATERIAL_CODE_KEY = 'MATERIAL_CODE_KEY';
const MATERIAL_DESCRIPTION_KEY = 'MATERIAL_DESCRIPTION_KEY';
const MATERIAL_UNIT_KEY = 'MATERIAL_UNIT_KEY';

const renderComboBoxOptions = (serviceMasters: MaterialModel[]): ComboBoxType[] => {
  return serviceMasters.map(x => {
    const result: ComboBoxType = {
      ...x,
      label: `[${x.code}]-${x.description}`,
    }

    return result;
  })
}

const getCache = (): ComboBoxType | null => {
  const code = localStorage.getItem(MATERIAL_CODE_KEY);
  const description = localStorage.getItem(MATERIAL_DESCRIPTION_KEY);
  const unit = localStorage.getItem(MATERIAL_UNIT_KEY);
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

const setCache = (material: ComboBoxType) => {
  localStorage.setItem(MATERIAL_CODE_KEY, material.code);
  localStorage.setItem(MATERIAL_DESCRIPTION_KEY, material.description);
  localStorage.setItem(MATERIAL_UNIT_KEY, material.unit);
}

export default function MaterialsComboBox({
  value,
  onChange,
}: Props): JSX.Element {

  const [data, setData] = React.useState<MaterialModel[]>([]);

  const getData = async () => {
    try {
      setData(await materialService.getAll());
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
      label="Vật tư"
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
