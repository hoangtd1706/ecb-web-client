import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Divider,
  Grid,
  Typography,
} from '@material-ui/core';

import {
  alertActions,
  loadingActions,
  alertMessage,
  AppDispatch,
} from '../../../core';

import postService, { PostModel } from '../services/post';

const initialPost: PostModel = {
  id: 0,
  changedBy: '',
  changedTime: new Date(),
  content: '',
  createdBy: '',
  createdTime: new Date(),
  title: '',
  parentId: 0,
  order: 0,
}

export default function PostDetail(): JSX.Element {
  const dispatch: AppDispatch = useDispatch();
  const { postId }: never = useParams();

  const [post, setPost] = React.useState<PostModel>(initialPost);

  const refresh = async () => {
    dispatch(loadingActions.show());
    try {
      setPost(await postService.getById(postId));
    }
    catch {
      setPost(initialPost);
      dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
    }
    finally {
      dispatch(loadingActions.hide());
    }
  }

  React.useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h4">
          {post.title}
        </Typography>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
      </Grid>
    </Grid>
  )
}