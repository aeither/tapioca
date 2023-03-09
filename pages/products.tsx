import * as React from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import { useDB, useProducts } from '@/lib/hooks/use-db'

export default function BasicButtons() {
  const { addProduct, createNewOrder } = useDB()
  const [orderId, setOrderId] = React.useState('')
  const products = useProducts({ orderId })

  return (
    <Stack spacing={2} direction="row">
      <div>
        {products.data &&
          products.data.map((product) => (
            <>
              <div>{product.title}</div>
              <div>{product.price}</div>
            </>
          ))}
      </div>
      <Button variant="text">Text</Button>
      <Button
        variant="contained"
        onClick={() =>
          addProduct.mutateAsync({
            orderId: '123',
            price: 0.001,
            title: 'Burger 1',
          })
        }
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
