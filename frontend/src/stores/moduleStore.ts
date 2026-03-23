import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ActiveModule = 'gestion' | 'sgsst'

interface ModuleStore {
  activeModule: ActiveModule
  setModule: (module: ActiveModule) => void
}

export const useModuleStore = create<ModuleStore>()(
  persist(
    (set) => ({
      activeModule: 'gestion',
      setModule: (module) => set({ activeModule: module }),
    }),
    { name: 'active-module' }
  )
)
