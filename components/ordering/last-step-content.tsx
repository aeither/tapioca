import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useWatch } from 'react-hook-form-mui'
export default function LastStepContent(props: { handleReset: () => void }) {
  const [name, price, drink, sauce, dressing] = useWatch({
    name: ['name', 'price', 'drink', 'sauce', 'dressing'],
  })

  return (
    <>
      <Typography>{name}</Typography>
      <Typography>{drink} x 1</Typography>
      <Typography>{sauce} x 1</Typography>
      <Typography>{dressing} x 1</Typography>
      <Typography>{price} USDC</Typography>
      <div className="mt-2 flex gap-2">
        <Button type="button" variant="text" onClick={props.handleReset}>
          Reset
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!(drink && sauce && dressing)}
        >
          Confirm
        </Button>
      </div>
    </>
  )
}
