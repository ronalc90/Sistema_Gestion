import { useState } from 'react'

export type ModalMode = 'create' | 'edit' | 'view' | null

export function useCrudPage<T extends { id: string }>(initialData: T[]) {
  const [items, setItems] = useState<T[]>(initialData)
  const [modal, setModal] = useState<ModalMode>(null)
  const [selected, setSelected] = useState<T | null>(null)
  const [confirm, setConfirm] = useState(false)
  const [search, setSearch] = useState('')

  const openCreate = () => { setSelected(null); setModal('create') }
  const openView = (item: T) => { setSelected(item); setModal('view') }
  const openEdit = (item: T) => { setSelected(item); setModal('edit') }
  const openDelete = (item: T) => { setSelected(item); setConfirm(true) }
  const closeModal = () => setModal(null)
  const closeConfirm = () => { setConfirm(false); setSelected(null) }

  const addItem = (data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem = {
      ...data,
      id: `id-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as T
    setItems((prev) => [newItem, ...prev])
    setModal(null)
    return newItem
  }

  const updateItem = (data: Partial<T>) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === selected?.id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i
      )
    )
    setModal(null)
  }

  const deleteItem = () => {
    setItems((prev) => prev.filter((i) => i.id !== selected?.id))
    closeConfirm()
  }

  return {
    items,
    setItems,
    modal,
    selected,
    confirm,
    search,
    setSearch,
    openCreate,
    openView,
    openEdit,
    openDelete,
    closeModal,
    closeConfirm,
    addItem,
    updateItem,
    deleteItem,
  }
}
