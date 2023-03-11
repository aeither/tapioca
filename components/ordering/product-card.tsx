import { CardActionArea, Chip } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import ProductDialog from './product-dialog'

export type ProductCardProps = {
  id?: number
  image: string
  name: string
  description?: string
  ingredients: string[]
  price: number
  handleClickOpen: () => void
  handleClose: () => void
}

export default function ProductCard(props: Omit<ProductCardProps, 'handleClose'>) {
  return (
    <Card sx={{ width: '100%', maxWidth: 345, height: '100%' }}>
      <CardActionArea onClick={props.handleClickOpen}>
        <CardMedia
          component="img"
          height="140"
          image={props.image}
          alt={props.name}
          sx={{ objectFit: 'cover', height: '180px', width: '100%' }}
        />
        <CardContent className="flex h-full flex-col justify-between">
          <Typography gutterBottom variant="h5" height={'60px'} component="div">
            {props.name}
          </Typography>
          <Typography variant="body1" fontWeight={'bold'} color="text.accent">
            {props.price} $
          </Typography>
          <div className="flex flex-wrap gap-2">
            {props.ingredients.map((ingredient, i) => (
              <Chip key={i} label={ingredient} size="small" />
            ))}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
