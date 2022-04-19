import React from 'react';

import { checkRolePermission } from '../configs';

import EditPost from './EditPost';
import PostDetail from './PostDetail';

export default function PostView(): JSX.Element {
  const [isCreator, setIsCreator] = React.useState<boolean>(false);

  const refresh = async () => {
    setIsCreator(await checkRolePermission('CREATOR_ROLE'));
  }

  React.useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isCreator ? <EditPost /> : <PostDetail />;
}