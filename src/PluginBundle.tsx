import React from 'react';
import { Switch } from 'react-router-dom';

import Layout from './theme/Default';

import { useTypedSelector } from './core';

export default function PluginBundle(): JSX.Element {
  const contentList = useTypedSelector(s => s.layout.contentList).map(x => x.element);

  return (
    <Layout>
      <Switch>
        {contentList}
      </Switch>
    </Layout>
  );
}
