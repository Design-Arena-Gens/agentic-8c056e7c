import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, Category, Product } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Gem, MapPin, Phone, Eye } from 'lucide-react';

export function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, prods] = await Promise.all([
          api.getCategories(),
          api.getProducts(),
        ]);
        setCategories(cats);
        setFeaturedProducts(prods.slice(0, 8));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatPrice = (priceInPaise: number) => {
    return `₹${(priceInPaise / 100).toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-yellow-600 to-yellow-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to JEWELIA</h1>
          <p className="text-xl mb-8">Discover exquisite jewelry from local artisans across India</p>
          <div className="flex justify-center space-x-4">
            <Link to="/products">
              <Button size="lg" variant="secondary">
                Browse Products
              </Button>
            </Link>
            <Link to="/shops">
              <Button size="lg" variant="outline" className="bg-white text-yellow-800 hover:bg-gray-100">
                Find Shops
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} to={`/products?category_id=${category.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-center mb-4">
                      <Gem className="h-12 w-12 text-yellow-600" />
                    </div>
                    <CardTitle className="text-center">{category.name}</CardTitle>
                    <CardDescription className="text-center capitalize">
                      {category.metal_type}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <img
                    src={product.images[0]?.image_url || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                  <p className="text-2xl font-bold text-yellow-600 mb-2">
                    {formatPrice(product.price_in_paise)}
                  </p>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {product.shop.city.name}, {product.shop.city.state.name}
                  </div>
                  {product.has_ar_model && (
                    <div className="flex items-center text-sm text-blue-600 mb-2">
                      <Eye className="h-4 w-4 mr-1" />
                      AR Preview Available
                    </div>
                  )}
                  {product.try_at_home_available && (
                    <div className="text-sm text-green-600">Try at Home Available</div>
                  )}
                </CardContent>
                <CardFooter className="flex space-x-2">
                  <Link to={`/products/${product.id}`} className="flex-1">
                    <Button className="w-full">View Details</Button>
                  </Link>
                  <a
                    href={`https://wa.me/${product.shop.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose JEWELIA?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="bg-yellow-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Artisans</h3>
              <p className="text-gray-600">
                Connect with verified jewelry shops in your city and support local businesses
              </p>
            </div>
            <div>
              <div className="bg-yellow-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AR Preview</h3>
              <p className="text-gray-600">
                Visualize jewelry with augmented reality before making a purchase
              </p>
            </div>
            <div>
              <div className="bg-yellow-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Try at Home</h3>
              <p className="text-gray-600">
                Request to try jewelry at home before buying with direct shop contact
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
