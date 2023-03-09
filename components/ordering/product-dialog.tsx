import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import {
  FormContainer,
  TextFieldElement,
  RadioButtonGroup,
} from "react-hook-form-mui";
import ProductCard, { ProductCardProps } from "./product-card";
import MenuStepper from "./menu-stepper";

export default function ProductDialog(
  props: Omit<ProductCardProps, "handleClickOpen" | "handleClose">,
) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ProductCard handleClickOpen={handleClickOpen} {...props} />
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Configure Menu</DialogTitle>
        <DialogContent>
          <MenuStepper handleClose={handleClose} {...props} />
        </DialogContent>
      </Dialog>
    </>
  );
}
