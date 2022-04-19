import React from 'react';

import {
  ComboBox,
} from '@nvdunginest/emis-mui';

import {
  versionNumberEnum,
} from '../services/common';

import clusterService, {
  ClusterModel,
} from '../services/cluster';

type ComboBoxType = {
  code: string;
  description: string;
  label: string;
}

type Props = {
  projectCode: string;
  value: ClusterModel | null;
  onChange: (value: ClusterModel) => void;
}

const CLUSTER_CODE_KEY = 'CLUSTER_CODE_KEY';
const CLUSTER_DESCRIPTION_KEY = 'CLUSTER_DESCRIPTION_KEY';

const renderComboBoxOptions = (data: ClusterModel[]): ComboBoxType[] => {
  return data.map(x => {
    const result: ComboBoxType = {
      ...x,
      label: `[${x.code}]-${x.description}`,
    }

    return result;
  })
}

const getCache = (): ComboBoxType | null => {
  const code = localStorage.getItem(CLUSTER_CODE_KEY);
  const description = localStorage.getItem(CLUSTER_DESCRIPTION_KEY);
  if (code === null || description === null) {
    return null;
  }
  else {
    return {
      code: code,
      description: description,
      label: `[${code}]-${description}`,
    };
  }
}

const setCache = (cluster: ComboBoxType) => {
  localStorage.setItem(CLUSTER_CODE_KEY, cluster.code);
  localStorage.setItem(CLUSTER_DESCRIPTION_KEY, cluster.description);
}

export default function ServiceMastersComboBox({
  projectCode,
  value,
  onChange,
}: Props): JSX.Element {

  const [data, setData] = React.useState<ClusterModel[]>([]);

  const getData = async () => {
    try {
      setData(await clusterService.getAll(projectCode, versionNumberEnum.PACK));
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
        filePath: '',
        note: '',
        projectCode: '',
        versionNumber: versionNumberEnum.PACK,
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
        filePath: '',
        note: '',
        projectCode: '',
        versionNumber: versionNumberEnum.PACK,
      });
    }
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ComboBox
      required
      label="Cấu kiện điển hình"
      options={renderComboBoxOptions(data)}
      optionLabel="label"
      value={value !== null ? {
        code: value.code,
        label: `[${value.code}]-${value.description}`,
        description: value.description,
      } : null}
      getOptionSelected={(o, v) => o.code === v.code}
      onChange={handleChange}
    />
  );
}
