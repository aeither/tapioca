import { useOrderTotal, useProducts } from '@/libs/hooks/use-db'
import { useStore } from '@/libs/store'
import { Global } from '@emotion/react'
import { Payment } from '@mui/icons-material'
import Fastfood from '@mui/icons-material/Fastfood'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { grey } from '@mui/material/colors'
import CssBaseline from '@mui/material/CssBaseline'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { styled } from '@mui/material/styles'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import { toast } from 'sonner'
import PaymentDialog from './payment-dialog'

const drawerBleeding = 56

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window
}

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor:
    theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}))

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}))

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}))

export default function CheckoutDrawer(props: Props) {
  const { window } = props
  const [open, setOpen] = React.useState(false)

  const orderId = useStore((state) => state.orderId)
  const setOrderId = useStore((state) => state.setOrderId)
  const products = useProducts({ orderId })
  const orderTotal = useOrderTotal({ orderId })

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  // This is used only for the example
  const container = window !== undefined ? () => window().document.body : undefined

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(50% - ${drawerBleeding}px)`,

            overflow: 'visible',
          },
        }}
      />
      {/* <Box sx={{ textAlign: "center", pt: 1 }}>
        <Button onClick={toggleDrawer(true)}>Open</Button>
      </Box> */}
      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <div className="flex w-full justify-between px-4">
            <div className="flex gap-1 items-center">
              <Payment />
              <Typography sx={{ p: 2, color: 'text.secondary' }}>
                Swipe up to checktout
              </Typography>
            </div>
            <Typography sx={{ p: 2 }}>
              {orderTotal.data && orderTotal.data._sum.price
                ? orderTotal.data._sum.price.toFixed(2)
                : 0}{' '}
              $
            </Typography>
          </div>
        </StyledBox>
        <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: '100%',
            overflow: 'auto',
          }}
        >
          <List dense className="flex flex-col items-center justify-center">
            {products.data &&
              orderTotal.data &&
              products.data.map((product) => (
                <ListItem key={product.id} className="max-w-md">
                  <ListItemIcon>
                    <Fastfood />
                  </ListItemIcon>
                  <ListItemText>{product.title}</ListItemText>
                  <ListItemText className="text-end">{product.price}</ListItemText>
                </ListItem>
              ))}
          </List>
          <div className="flex justify-center w-full">
            <ButtonGroup
              className="max-w-md flex justify-center w-full"
              aria-label="outlined primary button group"
            >
              <Button
                className="w-full"
                variant="outlined"
                onClick={() => {
                  setOrderId(undefined)
                  toggleDrawer(false)
                  toast('Order Canceled')
                }}
              >
                Cancel
              </Button>
              {/* Go to scan QR pay Button */}
              <PaymentDialog />
            </ButtonGroup>
          </div>
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  )
}
