import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  orderId: string | undefined
  setOrderId: (targetAddress: string | undefined) => void
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      orderId: undefined,
      setOrderId: (orderId) => set(() => ({ orderId: orderId })),
    }),
    {
      name: 'tapioca-storage', // unique name
    },
  ),
)
