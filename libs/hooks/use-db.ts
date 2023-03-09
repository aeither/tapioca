import toast from 'sonner'
import { api } from '../api'

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
  const createNewOrder = api.db.createNewOrder.useMutation({
    onError: ({ data }: any) => {
      console.error(data)
      toast.error('mutation error')
    },
  })

  const addProduct = api.db.addProduct.useMutation({
    onError: ({ data }: any) => {
      console.error(data)
      toast.error('mutation error')
    },
  })

  return {
    createNewOrder,
    addProduct,
  }
}
