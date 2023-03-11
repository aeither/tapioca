import { useDB } from '@/libs/hooks/use-db'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useState } from 'react'
import { SortableItem } from './sortable-card'

export default function SortableOrders() {
  const [items, setItems] = useState([1, 2, 3])
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )
  const { orders } = useDB()

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {orders.data && (
        <SortableContext items={orders.data} strategy={verticalListSortingStrategy}>
          {orders.data
            .filter((order) => order.customerAddress !== null)
            .map((order) => (
              <SortableItem key={order.id} {...order} />
            ))}
        </SortableContext>
      )}
    </DndContext>
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(Number(active.id))
        const newIndex = items.indexOf(Number(over.id))

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }
}
