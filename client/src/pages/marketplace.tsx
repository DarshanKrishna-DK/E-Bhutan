import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ProductCard from "@/components/product-card";
import MiniAppCard from "@/components/mini-app-card";
import { insertProductSchema } from "@shared/schema";
import { ShoppingCart, Plus, Store, Smartphone, Search, Filter } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { z } from "zod";
import { BuddhaFace, Stupa, LotusPattern } from "@/components/cultural-patterns";

const productFormSchema = insertProductSchema.extend({
  price: z.string().min(1, "Price is required"),
  browniePointsReward: z.number().min(0, "Brownie points must be non-negative"),
});

type ProductFormData = z.infer<typeof productFormSchema>;

export default function Marketplace() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"products" | "mini-apps">("products");
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      imageUrl: "",
      browniePointsReward: 0,
      inStock: true,
    },
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: miniApps, isLoading: miniAppsLoading } = useQuery({
    queryKey: ["/api/mini-apps"],
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      await apiRequest("POST", "/api/products", {
        ...data,
        sellerId: 1, // Mock seller ID
      });
    },
    onSuccess: () => {
      toast({
        title: "Product Listed",
        description: "Your product has been added to the marketplace!",
      });
      setIsProductDialogOpen(false);
      productForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = (productId: number) => {
    toast({
      title: "Added to Cart",
      description: "Product added to your shopping cart!",
    });
  };

  const handleLaunchApp = (appId: number) => {
    toast({
      title: "Launching App",
      description: "Mini-app is opening...",
    });
  };

  const onProductSubmit = (data: ProductFormData) => {
    createProductMutation.mutate(data);
  };

  const categories = ["Traditional Crafts", "Textiles", "Tea & Spices", "Jewelry", "Art", "Books", "Other"];

  const filteredProducts = selectedCategory && products
    ? products.filter((product: any) => product.category === selectedCategory)
    : products;

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative overflow-hidden">
      {/* Buddhist Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <BuddhaFace className="absolute top-12 right-12 w-52 h-52 text-orange-400/8" />
        <Stupa className="absolute top-1/4 left-8 w-24 h-32 text-yellow-400/12" />
        <LotusPattern className="absolute bottom-28 right-1/3 w-40 h-40 text-orange-400/6" />
        <BuddhaFace className="absolute bottom-12 left-1/4 w-32 h-32 text-yellow-400/10" />
        <Stupa className="absolute top-16 right-1/4 w-18 h-24 text-orange-400/8" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Digital Marketplace</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover authentic Bhutanese products, services, and experiences. Support local artisans and businesses while earning Brownie Points.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg p-1 shadow-sm border">
            <Button
              variant={activeTab === "products" ? "default" : "ghost"}
              onClick={() => setActiveTab("products")}
              className="flex items-center"
            >
              <Store className="w-4 h-4 mr-2" />
              Products
            </Button>
            <Button
              variant={activeTab === "mini-apps" ? "default" : "ghost"}
              onClick={() => setActiveTab("mini-apps")}
              className="flex items-center"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Mini-Apps
            </Button>
          </div>
        </div>

        {activeTab === "products" && (
          <>
            {/* Filters and Actions */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    List Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>List a New Product</DialogTitle>
                  </DialogHeader>
                  <Form {...productForm}>
                    <form onSubmit={productForm.handleSubmit(onProductSubmit)} className="space-y-4">
                      <FormField
                        control={productForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Traditional Kira" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={productForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your product, its origin, and what makes it special..."
                                className="h-24"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={productForm.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price (USD)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={productForm.control}
                          name="browniePointsReward"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Brownie Points Reward</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={productForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={productForm.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsProductDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createProductMutation.isPending}>
                          {createProductMutation.isPending ? "Listing..." : "List Product"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Products Grid */}
            {productsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-video bg-gray-200"></div>
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProducts?.length ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Products Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {selectedCategory 
                      ? `No products found in the "${selectedCategory}" category.`
                      : "No products available at the moment."
                    }
                  </p>
                  {selectedCategory && (
                    <Button variant="outline" onClick={() => setSelectedCategory("")}>
                      Show All Products
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {activeTab === "mini-apps" && (
          <div className="space-y-8">
            {/* Mini-App Store Header */}
            <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">Mini-App Store</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Discover mini-applications that enhance your Digital Bhutan experience. 
                  From language learning to digital wallet management.
                </p>
              </CardContent>
            </Card>

            {/* Mini-Apps Grid */}
            {miniAppsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : miniApps?.length ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {miniApps.map((app: any) => (
                  <MiniAppCard key={app.id} miniApp={app} onLaunch={handleLaunchApp} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Smartphone className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Mini-Apps Available</h3>
                  <p className="text-muted-foreground">
                    Mini-applications are being developed. Check back soon for exciting new tools!
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Featured Mini-Apps (Mock for demo) */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Mini-Apps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      name: "Learn Dzongkha",
                      description: "Interactive language learning with cultural context",
                      icon: "fas fa-language",
                      rating: 4.9,
                      users: 2300,
                      featured: true
                    },
                    {
                      name: "NuBuck Wallet",
                      description: "Manage your digital currency and transactions",
                      icon: "fas fa-coins",
                      rating: 4.7,
                      users: 1800,
                      featured: true
                    },
                    {
                      name: "Carbon Tracker",
                      description: "Track your environmental impact",
                      icon: "fas fa-seedling",
                      rating: 4.2,
                      users: 956,
                      featured: true
                    }
                  ].map((app, index) => (
                    <Card key={index} className="border-2 border-primary/20">
                      <CardContent className="p-6">
                        <div className="w-16 h-16 bhutan-gradient rounded-xl flex items-center justify-center mb-4">
                          <i className={`${app.icon} text-white text-2xl`}></i>
                        </div>
                        <h4 className="font-bold text-foreground mb-2">{app.name}</h4>
                        <p className="text-muted-foreground text-sm mb-4">{app.description}</p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center text-yellow-500">
                            <span className="text-sm">★ {app.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {app.users.toLocaleString()} users
                          </span>
                        </div>
                        <Badge className="mb-3">Featured</Badge>
                        <Button className="w-full" size="sm">
                          Launch App
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
