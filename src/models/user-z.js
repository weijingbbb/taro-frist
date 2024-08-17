import { create } from 'zustand'

const useBoundStore = create((set) => ({
  count: 0,
  text: 'hello',
  increasePopulation: () => set((state) => ({ count: state.count + 1 })),
  setText: (text) => set({ text }),
}))

export default useBoundStore
