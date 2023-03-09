import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  orderId: string
  setOrderId: (targetAddress: string) => void
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      orderId: '',
      setOrderId: (orderId) => set(() => ({ orderId: orderId })),
    }),
    {
      name: 'tapioca-storage', // unique name
    },
  ),
)
