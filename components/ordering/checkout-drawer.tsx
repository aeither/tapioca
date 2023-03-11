import { useDB, useOrderTotal, useProducts } from '@/libs/hooks/use-db'
import { useStore } from '@/libs/store'
import { trpc } from '@/libs/utils/trpc'
import { Global } from '@emotion/react'
import { Payment } from '@mui/icons-material'
import Fastfood from '@mui/icons-material/Fastfood'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
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
import { FormContainer, TextFieldElement } from 'react-hook-form-mui'
import { toast } from 'sonner'
import { AnimatedPrice } from './animated-price'
import PaymentDialog from './payment-dialog'
import SaveIcon from '@mui/icons-material/Save'

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
  const utils = trpc.useContext()

  const [open, setOpen] = React.useState(false)
  const [tableNum, setTableNum] = React.useState<number>()

  const orderId = useStore((state) => state.orderId)
  const setOrderId = useStore((state) => state.setOrderId)
  const products = useProducts({ orderId })
  const orderTotal = useOrderTotal({ orderId })
  const { updateOrder } = useDB()

  const defaultValues: { table: undefined | number } = {
    table: undefined,
  }

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
              <AnimatedPrice
                price={
                  orderTotal.data && orderTotal.data._sum.price
                    ? orderTotal.data._sum.price.toFixed(2)
                    : 0
                }
              />
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
          {tableNum ? (
            <div className="flex flex-col items-center justify-center py-4 gap-2">
              <Typography sx={{ p: 2, color: 'text.secondary' }}>
                Table Number: {tableNum}
              </Typography>
            </div>
          ) : (
            <FormContainer
              defaultValues={defaultValues}
              onSuccess={async (data, e) => {
                e?.preventDefault()
                if (orderId) {
                  const order = await updateOrder.mutateAsync({
                    orderId,
                    table: data.table,
                  })
                  await utils.db.orderById.invalidate({ orderId })
                  if (order && order.table) setTableNum(order.table)
                }
              }}
            >
              <div className="flex flex-col items-center justify-center py-4 gap-2">
                <Typography sx={{ p: 2, color: 'text.secondary' }}>
                  Introduce the number you see on the table.
                </Typography>
                <TextFieldElement
                  type={'number'}
                  name="table"
                  label="Table Number"
                  className=""
                  required
                />
                <LoadingButton
                  loading={updateOrder.isLoading}
                  type={'submit'}
                  color={'primary'}
                  variant={'contained'}
                >
                  Add Number
                </LoadingButton>
              </div>
            </FormContainer>
          )}

          {products.data && orderTotal.data ? (
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
          ) : (
            <div className="flex justify-center w-full">
              <Typography sx={{ p: 2, color: 'text.secondary' }}>
                Empty. Start ordering something.
              </Typography>
            </div>
          )}
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  )
}
