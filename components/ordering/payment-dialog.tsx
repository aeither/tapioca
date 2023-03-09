import { Button } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import * as React from 'react'


export default function PaymentDialog() {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Button
        className="w-full"
        variant="contained"
        onClick={() => {
          handleClickOpen()
        }}
      >
        Pay
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Configure Menu</DialogTitle>
        <DialogContent>
          <div>hello world</div>
        </DialogContent>
      </Dialog>
    </>
  )
}
