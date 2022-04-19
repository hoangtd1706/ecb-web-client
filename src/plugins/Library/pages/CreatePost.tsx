import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Typography,
  FormControl,
} from '@material-ui/core';
import {
  TextField,
  IconButton,
  ComboBox,
  Editor,
} from '@nvdunginest/emis-mui';

import {
  alertActions,
  loadingActions,
  alertMessage,
  AppDispatch,
} from '../../../core';

import postService, { AddPostModel, PostModel } from '../services/post';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: 0,
    marginBottom: theme.spacing(1.5),
  },
}));

export default function CreatePost(): JSX.Element {
  const classes = useStyles();
  const history = useHistory();
  const dispatch: AppDispatch = useDispatch();

  const [posts, setPosts] = React.useState<PostModel[]>([]);
  const [title, setTitle] = React.useState<string>('');
  const [content, setContent] = React.useState<string>('');
  const [parentId, setParentId] = React.useState<number>(0);

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

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  }

  const handleChangeParentId = (value: PostModel | null) => {
    if (value !== null) {
      setParentId(value.id);
    }
  }

  const handleSubmit = async () => {
    const model: AddPostModel = {
      content: content,
      title: title,
      parentId: parentId,
    };

    dispatch(loadingActions.show());
    try {
      const postId = await postService.create(model);
      dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
      history.push(`/library/posts/${postId}`);
    }
    catch {
      dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
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
          label="Tiêu đề"
          required
          value={title}
          onChange={handleChangeTitle}
        />
      </Grid>
      <Grid item xs={12}>
        <ComboBox
          options={posts}
          optionLabel="title"
          label="Thuộc về"
          required
          getOptionSelected={(o, v) => o.id === v.id}
          value={posts.find(x => x.id === parentId)}
          onChange={handleChangeParentId}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Nội dung</Typography>
        <FormControl fullWidth variant="outlined" className={classes.formControl}>
          <Editor
            value={content}
            onChange={(content) => { setContent(content); }}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <IconButton
          variant="contained"
          text="Lưu lại"
          color="success"
          icon="plus"
          onClick={handleSubmit}
        />
      </Grid>
    </Grid>
  )
}