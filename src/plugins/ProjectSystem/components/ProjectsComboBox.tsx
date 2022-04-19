import React from 'react';

import {
  ComboBox,
} from '@nvdunginest/emis-mui';

import projectService, {
  ProjectModel,
} from '../services/project';

type ComboBoxType = ProjectModel & {
  label: string;
}

type Props = {
  value: ProjectModel | null;
  onChange: (value: ProjectModel) => void;
}

const PROJECT_CODE_KEY = 'PROJECT_CODE_KEY';
const PROJECT_NAME_KEY = 'PROJECT_NAME_KEY';

const renderComboBoxOptions = (projects: ProjectModel[]): ComboBoxType[] => {
  return projects.map(x => {
    const result: ComboBoxType = {
      ...x,
      label: `[${x.code}]-${x.name}`,
    }

    return result;
  })
}

const getCache = (): ComboBoxType | null => {
  const code = localStorage.getItem(PROJECT_CODE_KEY);
  const name = localStorage.getItem(PROJECT_NAME_KEY);
  if (code === null || name === null) {
    return null;
  }
  else {
    return {
      code: code,
      name: name,
      label: `[${code}]-${name}`,
    };
  }
}

const setCache = (project: ComboBoxType) => {
  localStorage.setItem(PROJECT_CODE_KEY, project.code);
  localStorage.setItem(PROJECT_NAME_KEY, project.name);
}

export default function ProjectsComboBox({
  value,
  onChange,
}: Props): JSX.Element {

  const [projects, setProjects] = React.useState<ProjectModel[]>([]);

  const getProjects = async () => {
    try {
      setProjects(await projectService.getAll());
    }
    catch {
      setProjects([]);
    }
  }

  const handleProjectChange = (value: ComboBoxType | null) => {
    if (value !== null) {
      onChange({
        code: value.code,
        name: value.name,
      });
      setCache(value);
    }
  }

  React.useEffect(() => {
    const cacheProject = getCache();
    if (cacheProject !== null) {
      onChange({
        code: cacheProject.code,
        name: cacheProject.name,
      });
    }
    getProjects();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ComboBox
      required
      label="Dự án"
      options={renderComboBoxOptions(projects)}
      optionLabel="label"
      value={value !== null ? { code: value.code, name: value.name, label: `[${value.code}]-${value.name}`, } : null}
      getOptionSelected={(o, v) => o.code === v.code}
      onChange={handleProjectChange}
    />
  );
}
