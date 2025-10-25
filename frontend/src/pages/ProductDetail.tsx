import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, Product } from '../lib/api';
import { useAuth } from '../lib/auth';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { MapPin, Phone, Eye, Home, Star } from 'lucide-react';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      try {
        const [prod, revs] = await Promise.all([
          api.getProduct(id),
          api.getProductReviews(id),
        ]);
        setProduct(prod);
        setReviews(revs);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleTryAtHome = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/orders/create', { state: { product } });
  };

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

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <img
              src={product.images[0]?.image_url || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="w-full rounded-lg shadow-lg"
            />
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {product.images.slice(1).map((img) => (
                  <img
                    key={img.id}
                    src={img.image_url}
                    alt={product.name}
                    className="w-full h-24 object-cover rounded-md cursor-pointer hover:opacity-75"
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-yellow-600 mb-4">
              {formatPrice(product.price_in_paise)}
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-700">
                <span className="font-semibold mr-2">Category:</span>
                {product.category.name}
              </div>
              {product.weight_grams && (
                <div className="flex items-center text-gray-700">
                  <span className="font-semibold mr-2">Weight:</span>
                  {product.weight_grams}g
                </div>
              )}
              {product.purity && (
                <div className="flex items-center text-gray-700">
                  <span className="font-semibold mr-2">Purity:</span>
                  {product.purity}
                </div>
              )}
              <div className="flex items-center text-gray-700">
                <span className="font-semibold mr-2">Stock:</span>
                {product.stock_quantity > 0 ? `${product.stock_quantity} available` : 'Out of stock'}
              </div>
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            {product.has_ar_model && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="flex items-center text-blue-700 mb-2">
                  <Eye className="h-5 w-5 mr-2" />
                  <span className="font-semibold">AR Preview Available</span>
                </div>
                <Button variant="outline" className="w-full">
                  View in AR
                </Button>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <a
                href={`https://wa.me/${product.shop.whatsapp.replace(/[^0-9]/g, '')}?text=Hi, I'm interested in ${product.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full" size="lg">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Shop via WhatsApp
                </Button>
              </a>

              {product.try_at_home_available && (
                <Button onClick={handleTryAtHome} variant="outline" className="w-full" size="lg">
                  <Home className="h-5 w-5 mr-2" />
                  Request Try at Home
                </Button>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Shop Information</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg mb-2">{product.shop.name}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  {product.shop.address}
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  {product.shop.city.name}, {product.shop.city.state.name}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {product.shop.phone}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <p className="text-gray-600">No reviews yet</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{review.user.name}</span>
                    </div>
                    {review.comment && <p className="text-gray-700">{review.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
