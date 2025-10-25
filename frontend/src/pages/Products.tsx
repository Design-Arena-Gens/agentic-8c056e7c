import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, Product, Category, State, City } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { MapPin, Phone, Eye, Search } from 'lucide-react';

export function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category_id: searchParams.get('category_id') || '',
    state_id: '',
    city_id: '',
    has_ar_model: '',
    try_at_home_available: '',
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [cats, sts] = await Promise.all([
          api.getCategories(),
          api.getStates(),
        ]);
        setCategories(cats);
        setStates(sts);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (filters.state_id) {
      api.getCities(filters.state_id).then(setCities).catch(console.error);
    } else {
      setCities([]);
    }
  }, [filters.state_id]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const filterParams: Record<string, string> = {};
        if (filters.category_id) filterParams.category_id = filters.category_id;
        if (filters.city_id) filterParams.city_id = filters.city_id;
        if (filters.has_ar_model) filterParams.has_ar_model = filters.has_ar_model;
        if (filters.try_at_home_available) filterParams.try_at_home_available = filters.try_at_home_available;

        const prods = await api.getProducts(filterParams);
        setProducts(prods);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [filters]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setLoading(true);
      try {
        const results = await api.searchProducts(searchQuery);
        setProducts(results);
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatPrice = (priceInPaise: number) => {
    return `₹${(priceInPaise / 100).toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Browse Products</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="flex space-x-2">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Select value={filters.category_id} onValueChange={(value) => setFilters({ ...filters, category_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.state_id} onValueChange={(value) => setFilters({ ...filters, state_id: value, city_id: '' })}>
              <SelectTrigger>
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All States</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state.id} value={state.id}>{state.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.city_id} onValueChange={(value) => setFilters({ ...filters, city_id: value })} disabled={!filters.state_id}>
              <SelectTrigger>
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.has_ar_model} onValueChange={(value) => setFilters({ ...filters, has_ar_model: value })}>
              <SelectTrigger>
                <SelectValue placeholder="AR Preview" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="true">With AR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl">Loading products...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
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
                  <div className="text-sm text-gray-600 mb-2">
                    {product.category.name}
                  </div>
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
        )}
      </div>
    </div>
  );
}
