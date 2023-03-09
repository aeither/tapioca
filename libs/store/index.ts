import { create } from 'zustand'

interface State {
  orderId?: string
  setOrderId: (targetAddress: string) => void
}

export const useStore = create<State>((set) => ({
  orderId: undefined,
  setOrderId: (orderId) => set(() => ({ orderId: orderId })),
}))
