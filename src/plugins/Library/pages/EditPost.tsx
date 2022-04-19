import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
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

import postService, { PostModel } from '../services/post';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: 0,
    marginBottom: theme.spacing(1.5),
  },
}));

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

export default function EditPost(): JSX.Element {
  const classes = useStyles();
  const { postId }: never = useParams();
  const dispatch: AppDispatch = useDispatch();

  const [post, setPost] = React.useState<PostModel>(initialPost);
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

  const getPostDetail = async () => {
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

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, title: event.target.value });
  }

  const handleChangeParentId = (value: PostModel | null) => {
    if (value !== null) {
      setPost({ ...post, parentId: value.id });
    }
  }

  const handleSubmit = async () => {
    dispatch(loadingActions.show());
    try {
      await postService.edit(post.id, post);
      dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
    }
    catch {
      dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
    }
    finally {
      dispatch(loadingActions.hide());
    }
  }

  const handleRemove = async () => {
    const confirm = window.prompt('Nhập tiêu đề bài viết để xác nhận xóa!');
    if (confirm === post.title) {
      dispatch(loadingActions.show());
      try {
        await postService.remove(post.id);
        dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
      }
      catch {
        dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
      }
      finally {
        dispatch(loadingActions.hide());
      }
    }
  }

  const handleChangeOrder = async (changeType: number) => {
    dispatch(loadingActions.show());
    try {
      await postService.changeOrder(post.id, changeType);
      dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
    }
    catch {
      dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
    }
    finally {
      dispatch(loadingActions.hide());
    }
  }

  React.useEffect(() => {
    getPostDetail();
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <TextField
          label="Tiêu đề"
          required
          value={post.title}
          onChange={handleChangeTitle}
        />
      </Grid>
      <Grid item xs={12}>
        <ComboBox
          options={posts.filter(x => x.id !== post.id)}
          optionLabel="title"
          label="Thuộc về"
          required
          getOptionSelected={(o, v) => o.id === v.id}
          value={posts.find(x => x.id === post.parentId)}
          onChange={handleChangeParentId}
        />
      </Grid>
      <Grid item>
        <IconButton
          variant="contained"
          text="Lên đầu"
          color="primary"
          icon="angle-double-up"
          onClick={() => { handleChangeOrder(1); }}
        />
      </Grid>
      <Grid item>
        <IconButton
          variant="contained"
          text="Lên trên"
          color="primary"
          icon="angle-up"
          onClick={() => { handleChangeOrder(2); }}
        />
      </Grid>
      <Grid item>
        <IconButton
          variant="contained"
          text="Xuống dưới"
          color="primary"
          icon="angle-down"
          onClick={() => { handleChangeOrder(3); }}
        />
      </Grid>
      <Grid item>
        <IconButton
          variant="contained"
          text="Xuống cuối"
          color="primary"
          icon="angle-double-down"
          onClick={() => { handleChangeOrder(4); }}
        />
      </Grid>
      <Grid item>
        <IconButton
          variant="contained"
          text="Xóa bài viết"
          color="danger"
          icon="trash-alt"
          onClick={() => { handleRemove(); }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Nội dung</Typography>
        <FormControl fullWidth variant="outlined" className={classes.formControl}>
          <Editor
            value={post.content}
            onChange={(content) => { setPost({ ...post, content: content }) }}
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