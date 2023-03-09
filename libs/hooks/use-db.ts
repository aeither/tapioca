import { toast } from 'sonner'
import { api } from '../api'
import { useQueryClient } from '@tanstack/react-query'

export const useOrderTotal = ({ orderId }: { orderId: string | undefined }) => {
  const orderTotal = api.db.orderTotal.useQuery(
    { orderId: orderId! },
    {
      enabled: !!orderId,
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  )
  return orderTotal
}

export const useProducts = ({ orderId }: { orderId: string | undefined }) => {
  const products = api.db.products.useQuery(
    { orderId: orderId! },
    {
      enabled: !!orderId,
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  )
  return products
}

export function useDB() {
  const queryClient = useQueryClient()

  const orders = api.db.orders.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
  })

  const createNewOrder = api.db.createNewOrder.useMutation({
    onError: ({ data }: any) => {
      console.error(data)
      toast.error('mutation error')
    },
  })

  const addProduct = api.db.addProduct.useMutation({
    onSuccess() {
      queryClient.refetchQueries()
      console.log('refetch all')
    },
    onError: ({ data }: any) => {
      console.error(data)
      toast.error('mutation error')
    },
  })

  return {
    orders,
    createNewOrder,
    addProduct,
  }
}
