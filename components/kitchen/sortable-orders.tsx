import { useDB } from '@/libs/hooks/use-db'
import { PaymentStatus } from '@prisma/client'
import { SortableItem } from './sortable-card'

export default function SortableOrders() {
  const { orders } = useDB()

  return (
    <>
      {orders.data &&
        orders.data
          .filter((order) => order.status == PaymentStatus.SUCCEEDED)
          .map((order) => <SortableItem key={order.id} {...order} />)}
    </>
  )
}
