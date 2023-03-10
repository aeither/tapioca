import { toast } from 'sonner'
import { api } from '../api'
import { useQueryClient } from '@tanstack/react-query'
import { useStore } from '@/libs/store'

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
export const useOrderById = ({ orderId }: { orderId: string | undefined }) => {
  const orderById = api.db.orderById.useQuery(
    { orderId: orderId! },
    {
      enabled: !!orderId,
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  )
  return orderById
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
  const setOrderId = useStore((state) => state.setOrderId)

  const orders = api.db.orders.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
  })

  const createNewOrder = api.db.createNewOrder.useMutation({
    onSuccess(data) {
      setOrderId(data.id)
    },
    onError: ({ data }: any) => {
      console.error(data)
      toast.error('mutation error')
    },
  })

  const addProduct = api.db.addProduct.useMutation({
    onSuccess(data) {
      queryClient.refetchQueries()
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
