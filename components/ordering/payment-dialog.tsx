import { useOrderById } from '@/libs/hooks/use-db'
import { useStore } from '@/libs/store'
import { Button } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { createQR, encodeURL, TransactionRequestURLFields } from '@solana/pay'
import * as React from 'react'
import { useEffect, useRef } from 'react'

export default function PaymentDialog() {
  const qrRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState(false)
  const orderId = useStore((state) => state.orderId)
  const order = useOrderById({ orderId })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (!order.data) return
    // window.location is only available in the browser, so create the URL in here
    const { location } = window
    const apiUrl = `${location.protocol}//${location.host}/api/transaction?network=devnet&reference=${order.data.reference}`
    const urlParams: TransactionRequestURLFields = {
      link: new URL(apiUrl),
      label: 'My Store',
    }
    const solanaUrl = encodeURL(urlParams)
    console.log(
      '🚀 ~ file: TransactionRequestQR.tsx:23 ~ useEffect ~ solanaUrl',
      solanaUrl,
    )
    const qr = createQR(solanaUrl, 220, 'transparent')
    qr.update({ backgroundOptions: { round: 20 } })
    if (qrRef.current) {
      qrRef.current.innerHTML = ''
      qr.append(qrRef.current)
    }
  }, [order.data])

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
          <div>
            hello world
            <div className="rounded-2xl">
              <div ref={qrRef} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
