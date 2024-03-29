import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import * as React from 'react'

import MenuStepper from './menu-stepper'
import ProductCard, { ProductCardProps } from './product-card'

export default function ProductDialog(
  props: Omit<ProductCardProps, 'handleClickOpen' | 'handleClose'>,
) {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

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
  )
}
