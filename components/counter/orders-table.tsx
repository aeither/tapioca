import { useDB } from '@/libs/hooks/use-db'
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import * as React from 'react'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Order ID', width: 180 },
  { field: 'updatedAt', headerName: 'Last update', width: 200 },
  { field: 'customerAddress', headerName: 'Customer', width: 180 },
  { field: 'table', headerName: 'Table N.', width: 120 },
  { field: 'amount', headerName: 'Amount', width: 120 },
  { field: 'status', headerName: 'Status', width: 120 },
]

export function OrdersTable() {
  const { orders } = useDB()

  // orders.data[0].
  const rows: GridRowsProp = React.useMemo(() => {
    let arr: any[] = []
    if (orders.data) {
      orders.data.map((order) =>
        arr.push({
          id: order.id,
          updatedAt: order.updatedAt,
          customerAddress: order.customerAddress,
          table: order.table,
          amount: order.amount,
          status: order.status,
        }),
      )
    }
    return arr
  }, [orders.data])

  return (
    <div className="w-full h-[calc(100vh-24px-53px)]">
      <DataGrid rows={rows} columns={columns} />
    </div>
  )
}
