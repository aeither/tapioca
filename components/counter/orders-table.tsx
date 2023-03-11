import { useDB } from '@/libs/hooks/use-db'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
  useGridApiContext,
} from '@mui/x-data-grid'
import { PaymentStatus } from '@prisma/client'
import * as React from 'react'
import { toast } from 'sonner'

function SelectEditInputCell(props: GridRenderCellParams) {
  const { id, value, field } = props
  const apiRef = useGridApiContext()
  const { updateOrder } = useDB()

  const handleChange = async (event: SelectChangeEvent) => {
    const rowData = apiRef.current.getRow(id)

    const promise1 = updateOrder.mutateAsync({
      orderId: rowData.id,
      status: event.target.value,
    })
    const promise2 = apiRef.current.setEditCellValue({
      id,
      field,
      value: event.target.value,
    })

    toast.promise(Promise.all([promise1, promise2]), {
      loading: 'Loading...',
      success: (data) => {
        console.log('Order updated successfully!')
        return `Order updated successfully!`
      },
      error: 'Error',
    })
    apiRef.current.stopCellEditMode({ id, field })
  }

  return (
    <Select
      value={value}
      onChange={handleChange}
      size="small"
      sx={{ height: 1 }}
      native
      autoFocus
    >
      <option>{PaymentStatus.SUCCEEDED}</option>
      <option>{PaymentStatus.PENDING}</option>
      <option>{PaymentStatus.FAILED}</option>
      <option>{PaymentStatus.PREPARING}</option>
      <option>{PaymentStatus.READY}</option>
      <option>{PaymentStatus.SERVED}</option>
    </Select>
  )
}

const renderSelectEditInputCell: GridColDef['renderCell'] = (params) => {
  return <SelectEditInputCell {...params} />
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Order ID', width: 180 },
  { field: 'updatedAt', headerName: 'Last update', width: 200 },
  { field: 'customerAddress', headerName: 'Customer', width: 180 },
  { field: 'table', headerName: 'Table N.', width: 120 },
  { field: 'amount', headerName: 'Amount', width: 120 },
  {
    field: 'status',
    headerName: 'Status',
    renderEditCell: renderSelectEditInputCell,
    editable: true,
    width: 120,
  },
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
    <div className="w-full h-[calc(38vh-24px-53px)]">
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          filter: {
            filterModel: {
              items: [
                { field: 'status', operator: 'equals', value: PaymentStatus.READY },
              ],
            },
          },
          sorting: {
            sortModel: [{ field: 'updatedAt', sort: 'desc' }],
          },
        }}
      />
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          filter: {
            filterModel: {
              items: [
                { field: 'status', operator: 'equals', value: PaymentStatus.SUCCEEDED },
              ],
            },
          },
          sorting: {
            sortModel: [{ field: 'updatedAt', sort: 'desc' }],
          },
        }}
      />
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          filter: {
            filterModel: {
              items: [
                {
                  field: 'status',
                  operator: 'equals',
                  value: PaymentStatus.PENDING,
                },
              ],
            },
          },
          sorting: {
            sortModel: [{ field: 'updatedAt', sort: 'desc' }],
          },
        }}
      />
    </div>
  )
}
