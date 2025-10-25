import { useEffect, useState } from 'react';
import { api, Shop, Product } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Store, Package, ShoppingCart, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const myShops = await api.getMyShops();
        setShops(myShops);

        if (myShops.length > 0) {
          const allProducts = await Promise.all(
            myShops.map((shop: Shop) => api.getProducts({ shop_id: shop.id }))
          );
          setProducts(allProducts.flat());
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Shop Owner Dashboard</h1>
          <div className="flex space-x-4">
            <Link to="/dashboard/create-shop">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Shop
              </Button>
            </Link>
            <Link to="/dashboard/create-product">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Shops</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shops.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.filter(p => p.is_available).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>My Shops</CardTitle>
            </CardHeader>
            <CardContent>
              {shops.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">You haven't created any shops yet</p>
                  <Link to="/dashboard/create-shop">
                    <Button>Create Your First Shop</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {shops.map((shop) => (
                    <div key={shop.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{shop.name}</h3>
                        {shop.verified && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{shop.address}</p>
                      <p className="text-sm text-gray-600 mb-2">
                        {shop.city.name}, {shop.city.state.name}
                      </p>
                      <div className="flex space-x-2 mt-4">
                        <Link to={`/shops/${shop.id}`}>
                          <Button size="sm" variant="outline">View</Button>
                        </Link>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No products yet</p>
                  <Link to="/dashboard/create-product">
                    <Button>Add Your First Product</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src={product.images[0]?.image_url || 'https://via.placeholder.com/80'}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.category.name}</p>
                          <p className="text-lg font-bold text-yellow-600">
                            ₹{(product.price_in_paise / 100).toLocaleString('en-IN')}
                          </p>
                          <p className="text-sm text-gray-600">
                            Stock: {product.stock_quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
