import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import { IconButton, TextField, FormDialog } from "@nvdunginest/emis-mui";

import { useTypedSelector } from "../../../../core";

import { UpdateNetPriceModel, NetPriceItem } from "../../services/contract";
import { ContractDetailContext } from "../../stores/ContractDetailStore";

const useStyles = makeStyles(() => ({
  main: {
    lineHeight: 1,
  },
  sub: {
    lineHeight: 1.4,
    fontSize: "0.7rem",
    fontStyle: "italic",
  },
  head: {
    color: "#fff",
    backgroundColor: "#444",
    textTransform: "uppercase",
    fontSize: "0.8rem",
  },
}));

type NetPriceItemState = NetPriceItem & {
  newNetpr: string;
  code: string;
  text: string;
};

export default function UpdateNetPrice(): JSX.Element {
  const classes = useStyles();
  const { state, updateNetPrice } = React.useContext(ContractDetailContext);
  const currentUser = useTypedSelector((s) => s.auth.user);
  const { contract } = state;
  const [items, setItems] = React.useState<NetPriceItemState[]>([]);

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (
    ebeln: string,
    ebelp: string,
    packno: string,
    introw: string,
    value: string
  ) => {
    setItems(
      items.map((item) => {
        if (
          ebeln === item.ebeln &&
          ebelp === item.ebelp &&
          packno === item.packno &&
          introw === item.introw
        ) {
          item.newNetpr = value;

          return item;
        }

        return item;
      })
    );
  };

  const handleSubmit = async () => {
    setOpen(false);
    const model: UpdateNetPriceModel = {
      items: [],
    };

    items.map((item) => {
      const value = parseInt(item.newNetpr, 10);
      if (item.netpr !== value) {
        model.items.push({
          ebeln: item.ebeln,
          ebelp: item.ebelp,
          introw: item.introw,
          isService: item.isService,
          netpr: value,
          packno: item.packno,
        });
      }

      return true;
    });

    updateNetPrice(contract.contractNumber, model);
  };

  const checkPermission = (): boolean => {
    if (contract.status !== "P") {
      return false;
    }

    if (currentUser === null) {
      return false;
    }

    if (contract.createdBy !== currentUser.employeeId) {
      return false;
    }

    return true;
  };

  React.useEffect(() => {
    const newItems: NetPriceItemState[] = [];
    contract.items.map((item) => {
      if (!item.isService) {
        newItems.push({
          code: item.code,
          text: item.text,
          ebeln: item.ebeln,
          ebelp: item.ebelp,
          isService: false,
          netpr: item.netPrice,
          newNetpr: item.netPrice.toString(),
          packno: "",
          introw: "",
        });
      } else {
        item.subItems.map((subItem) => {
          newItems.push({
            code: subItem.code,
            text: subItem.text,
            packno: subItem.packno,
            introw: subItem.introw,
            isService: true,
            netpr: subItem.netPrice,
            newNetpr: subItem.netPrice.toString(),
            ebeln: "",
            ebelp: "",
          });
        });
      }

      return true;
    });

    setItems(newItems);
  }, [contract]);

  return checkPermission() ? (
    <Grid item>
      <FormDialog
        title="Cập nhật đơn giá net"
        onClose={handleClose}
        open={open}
        onSubmit={handleSubmit}
      >
        <Grid container spacing={1}>
          {items.map((item, index) => (
            <Grid container item spacing={1} key={index}>
              <Grid item xs={6}>
                <Typography className={classes.main} variant="subtitle2">
                  {item.text}
                </Typography>
                <Typography className={classes.sub} variant="caption">
                  {item.code === "" ? "-" : item.code}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Đơn giá Net"
                  value={item.newNetpr}
                  type="text"
                  onChange={(event) => {
                    handleChange(
                      item.ebeln,
                      item.ebelp,
                      item.packno,
                      item.introw,
                      event.target.value
                    );
                  }}
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </FormDialog>
      <IconButton
        variant="contained"
        color="dark"
        tooltip="Cập nhật giá net"
        icon="pen-square"
        text="Đơn giá Net"
        onClick={handleOpen}
      />
    </Grid>
  ) : (
    <></>
  );
}
