import React from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { makeStyles } from "@material-ui/core/styles";
import {
  Hidden,
  Avatar,
  Divider,
  Typography,
  IconButton,
  Tooltip,
} from "@material-ui/core";

import { useTypedSelector, AppDispatch } from "../../core";
import authActions from "../../core/actions/auth";
import { LayoutContext } from "./LayoutProvider";
import { useMsal } from "@azure/msal-react";

const useStyles = makeStyles((theme) => ({
  userSection: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    width: theme.spacing(4.2),
    height: theme.spacing(4.2),
    color: theme.palette.getContrastText(theme.palette.primary.main),
    backgroundColor: theme.palette.primary.main,
    marginRight: theme.spacing(1),
    textTransform: "uppercase",
  },
  text: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  title: {
    fontWeight: "bold",
  },
  note: {
    fontStyle: "italic",
    lineHeight: 1,
  },
}));

export default function UserInfo(): JSX.Element {
  const { instance } = useMsal();
  const classes = useStyles();
  const { drawerOpen } = React.useContext(LayoutContext);
  const { user } = useTypedSelector((state) => state.auth);
  const dispatch: AppDispatch = useDispatch();
  const getAvatar = (fullName: string): string => {
    const words = fullName.split(" ");
    while (words.length > 2) {
      words.shift();
    }

    let result = "";
    words.map((w) => {
      result = `${result}${w[0]}`;
      return true;
    });

    return result;
  };

  return user !== null ? (
    <>
      <Divider />
      {/* Lg */}
      <Hidden mdDown implementation="css">
        <div className={classes.userSection}>
          <Avatar
            className={classes.avatar}
            src={`data:image/jpeg;base64,${user.avatar}`}
          >
            {getAvatar(user.displayName)}
          </Avatar>
          <div className={classes.text}>
            <Typography className={classes.title} variant="body2" noWrap>
              {user.displayName}
            </Typography>
            <Typography
              className={classes.note}
              variant="caption"
            >{`MSNV: ${user.employeeId}`}</Typography>
          </div>
          <Tooltip title="Đăng xuất">
            <IconButton
              size="small"
              onClick={() => {
                dispatch(authActions.logout(instance));
              }}
            >
              <FontAwesomeIcon icon="power-off" />
            </IconButton>
          </Tooltip>
        </div>
      </Hidden>
      {/* Lg */}

      {/* Sm --> Md */}
      <Hidden lgUp xsDown implementation="css">
        <div className={classes.userSection}>
          <Avatar className={classes.avatar}>
            {getAvatar(user.displayName)}
          </Avatar>
          {drawerOpen && (
            <>
              <div className={classes.text}>
                <Typography className={classes.title} variant="body2" noWrap>
                  {user.displayName}
                </Typography>
                <Typography
                  className={classes.note}
                  variant="caption"
                >{`MSNV: ${user.employeeId}`}</Typography>
              </div>
              <Tooltip title="Đăng xuất">
                <IconButton
                  size="small"
                  onClick={() => {
                    dispatch(authActions.logout(instance));
                  }}
                >
                  <FontAwesomeIcon icon="power-off" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </div>
      </Hidden>
      {/* Sm --> Md */}

      {/* Xs */}
      <Hidden smUp implementation="css">
        <div className={classes.userSection}>
          <Avatar className={classes.avatar} src={user.avatar}>
            {getAvatar(user.displayName)}
          </Avatar>
          <div className={classes.text}>
            <Typography className={classes.title} variant="body2" noWrap>
              {user.displayName}
            </Typography>
            <Typography
              className={classes.note}
              variant="caption"
            >{`MSNV: ${user.employeeId}`}</Typography>
            <Typography
              className={classes.note}
              variant="caption"
            >{`MSNV: ${user.employeeId}`}</Typography>
          </div>
          <Tooltip title="Đăng xuất">
            <IconButton
              size="small"
              onClick={() => {
                dispatch(authActions.logout(instance));
              }}
            >
              <FontAwesomeIcon icon="power-off" />
            </IconButton>
          </Tooltip>
        </div>
      </Hidden>
      {/* Xs */}
    </>
  ) : (
    <></>
  );
}
