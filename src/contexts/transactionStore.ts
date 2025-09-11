import type { TransactionForm } from "@/types"
import { create } from "zustand"

interface TransactionStore {
  transaction: TransactionForm | null
  setTransaction: (transaction: TransactionForm | null) => void
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transaction: null,
  isOpen: false,
  setTransaction: (transaction: TransactionForm | null) => set({ transaction, isOpen: true }),
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}))



