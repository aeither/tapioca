import { CardActionArea, Chip } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

type ProductCardProps = {
  id?: number;
  image: string;
  name: string;
  description?: string;
  ingredients: string[];
};

export default function ProductCard(props: ProductCardProps) {
  return (
    <Card sx={{ maxWidth: 345, height: "100%" }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={props.image}
          alt={props.name}
          sx={{ objectFit: "cover", height: "180px", width: "100%" }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" height={"60px"} component="div">
            {props.name}
          </Typography>
          <Typography variant="body2" color="text.secondary"></Typography>

          <div className="flex flex-wrap gap-2">
            {props.ingredients.map((ingredient, i) => (
              <Chip key={i} label={ingredient} size="small" />
            ))}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
