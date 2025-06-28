import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow traditional-shadow">
      <div className="aspect-video bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-6xl">🏔️</div>
        )}
      </div>
      <CardContent className="p-6">
        <h4 className="font-bold text-foreground mb-2">{product.name}</h4>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(Number(product.price))}
          </span>
          {product.browniePointsReward > 0 && (
            <Badge className="bg-yellow-500 text-white">
              +{product.browniePointsReward} Points
            </Badge>
          )}
        </div>
        <Button 
          onClick={() => onAddToCart?.(product.id)}
          className="w-full bg-primary hover:bg-primary/90"
          disabled={!product.inStock}
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardContent>
    </Card>
  );
}
