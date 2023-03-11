import { useDB, useProducts } from '@/libs/hooks/use-db'
import { Chip } from '@mui/material'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Order, PaymentStatus } from '@prisma/client'
import { toast } from 'sonner'

function OrderCard(props: Order) {
  const products = useProducts({ orderId: props.id })
  const { updateOrder } = useDB()

  return (
    <Card sx={{ minWidth: 275 }} className="rounded border p-2 m-2">
      <CardContent>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {`${props.updatedAt.getHours()}:
            ${props.updatedAt.getMinutes()}:
            ${props.updatedAt.getSeconds()}`}
        </Typography>
        <div className="flex gap-2 py-2">
          <Chip label={`${props.amount} $`} variant="outlined" />
          <Chip label={`Table ${props.table}`} variant="outlined" />
        </div>
        <Typography variant="body2">
          {products.data &&
            products.data.map((product) => (
              <>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {product.title} x 1
                </Typography>
              </>
            ))}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          onClick={async () => {
            console.log('hello world')
            const promise = updateOrder.mutateAsync({
              orderId: props.id,
              status: PaymentStatus.READY,
            })
            toast.promise(promise, {
              loading: 'Loading...',
              success: () => {
                return `ready!!!`
              },
              error: 'Error',
            })
          }}
        >
          Ready!
        </Button>
      </CardActions>
    </Card>
  )
}

export function SortableItem(props: Order) {
  return (
    <div>
      <OrderCard {...props} />
    </div>
  )
}
