import * as React from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import { useDB, useProducts, useOrderTotal } from '@/libs/hooks/use-db'
import { useStore } from '@/libs/store'

export default function BasicButtons() {
  const { addProduct, createNewOrder } = useDB()
  const { orderId, setOrderId } = useStore()
  const products = useProducts({ orderId })
  const orderTotal = useOrderTotal({ orderId })
  console.log('🚀 ~ file: products.tsx:9 ~ BasicButtons ~ orderId:', orderId)
  console.log('🚀 ~ file: products.tsx:10 ~ BasicButtons ~ products:', products.data)
  console.log('🚀 ~ file: products.tsx:11 ~ BasicButtons ~ orderTotal:', orderTotal.data)

  return (
    <Stack spacing={2} direction="row">
      <div>
        {products.data &&
          orderTotal.data &&
          products.data.map((product) => (
            <>
              <div>{product.title}</div>
              <div>{product.price}</div>
              <div>Total: {orderTotal.data._sum.price}</div>
            </>
          ))}
      </div>
      <Button variant="text">Text</Button>
      <Button
        variant="contained"
        onClick={() => {
          if (!orderId) return
          addProduct.mutateAsync(
            {
              orderId,
              price: 0.001,
              title: 'Burger 1',
            },
            {
              onSuccess(data, variables, context) {
                products.refetch()
                orderTotal.refetch()
                console.log('dataid :', data.id)
              },
            },
          )
        }}
      >
        Contained
      </Button>
      <Button
        variant="outlined"
        onClick={() =>
          createNewOrder.mutateAsync(undefined, {
            onSuccess(data, variables, context) {
              setOrderId(data.id)
              console.log('dataid :', data.id)
            },
          })
        }
      >
        New Order
      </Button>
    </Stack>
  )
}
