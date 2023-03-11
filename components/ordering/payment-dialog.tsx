import { useOrderById } from '@/libs/hooks/use-db'
import useTransactionListener from '@/libs/hooks/useTransactionListener'
import { useStore } from '@/libs/store'
import { Button, Typography } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { createQR, encodeURL, TransactionRequestURLFields } from '@solana/pay'
import * as React from 'react'
import { useRef } from 'react'

export default function PaymentDialog() {
  const qrRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState(false)
  const orderId = useStore((state) => state.orderId)
  const order = useOrderById({ orderId })

  useTransactionListener({ reference: order.data && order.data.reference })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const createPayment = () => {
    if (!order.data) return
    // window.location is only available in the browser, so create the URL in here
    const { location } = window
    const apiUrl = `${location.protocol}//${location.host}/api/transaction?network=devnet&reference=${order.data.reference}&order=${order.data.id}`
    const urlParams: TransactionRequestURLFields = {
      link: new URL(apiUrl),
      label: 'Solana Burgers',
    }
    const solanaUrl = encodeURL(urlParams)

    const qr = createQR(solanaUrl, 220, 'transparent')
    qr.update({ backgroundOptions: { round: 20 } })

    if (qrRef.current) {
      qrRef.current.innerHTML = ''
      qr.append(qrRef.current)
    }
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
        <DialogTitle>Checkout</DialogTitle>
        <DialogContent>
          {order.data && order.data.table ? (
            <div className="flex flex-col justify-center items-center">
              <div className="flex gap-2">
                <Button>Pay with Credit Card</Button>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => createPayment()}
                >
                  Pay with SolanaPay
                </Button>
              </div>
              <div className="rounded-2xl">
                <div ref={qrRef} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <Typography sx={{ p: 2, color: 'text.secondary' }}>
                Table Number is missing. Go back and add it.
              </Typography>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
