import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Divider,
  Grid,
  Typography,
} from '@material-ui/core';

import {
  TextField,
} from '@nvdunginest/emis-mui';

import {
  alertActions,
  loadingActions,
  alertMessage,
  AppDispatch,
} from '../../../core';

import postService, { PostModel } from '../services/post';

export default function Dashboard(): JSX.Element {
  const dispatch: AppDispatch = useDispatch();

  const [keyWord, setKeyWord] = React.useState<string>('');
  const [posts, setPosts] = React.useState<PostModel[]>([]);

  const refresh = async () => {
    dispatch(loadingActions.show());
    try {
      setPosts(await postService.getAll());
    }
    catch {
      dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
    }
    finally {
      dispatch(loadingActions.hide());
    }
  }

  React.useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <TextField
          label="Tìm kiếm"
          value={keyWord}
          onChange={(e) => { setKeyWord(e.target.value); }}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      {posts.filter(x => x.title.includes(keyWord)).map(post => (
        <Grid item key={post.id} xs={12}>
          <Grid container spacing={4}>
            <Grid item>
              <Link to={`/library/posts/${post.id}`}>
                <Typography variant="h6">{post.title}</Typography>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  )
}
