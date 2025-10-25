import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, Shop, State, City } from '../lib/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { MapPin, Phone, Star } from 'lucide-react';

export function Shops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    state_id: '',
    city_id: '',
    verified: '',
  });

  useEffect(() => {
    api.getStates().then(setStates).catch(console.error);
  }, []);

  useEffect(() => {
    if (filters.state_id) {
      api.getCities(filters.state_id).then(setCities).catch(console.error);
    } else {
      setCities([]);
    }
  }, [filters.state_id]);

  useEffect(() => {
    const loadShops = async () => {
      setLoading(true);
      try {
        const filterParams: Record<string, string> = {};
        if (filters.city_id) filterParams.city_id = filters.city_id;
        if (filters.verified) filterParams.verified = filters.verified;

        const shopsData = await api.getShops(filterParams);
        setShops(shopsData);
      } catch (error) {
        console.error('Error loading shops:', error);
      } finally {
        setLoading(false);
      }
    };
    loadShops();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Browse Jewelry Shops</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={filters.state_id} onValueChange={(value) => setFilters({ ...filters, state_id: value, city_id: '' })}>
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
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
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.verified} onValueChange={(value) => setFilters({ ...filters, verified: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Verification Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Shops</SelectItem>
                <SelectItem value="true">Verified Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl">Loading shops...</div>
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No shops found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <Card key={shop.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{shop.name}</CardTitle>
                    {shop.verified && (
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-green-800" />
                        Verified
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-start text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm">{shop.address}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{shop.city.name}, {shop.city.state.name}</span>
                    </div>
                    {shop.taluka && (
                      <div className="text-sm text-gray-600">
                        Taluka: {shop.taluka.name}
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span className="text-sm">{shop.phone}</span>
                    </div>
                    {shop.description && (
                      <p className="text-sm text-gray-700 mt-2">{shop.description}</p>
                    )}
                    <div className="text-sm font-semibold text-yellow-600 capitalize">
                      {shop.membership_status} Member
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex space-x-2">
                  <Link to={`/shops/${shop.id}`} className="flex-1">
                    <Button className="w-full">View Shop</Button>
                  </Link>
                  <a
                    href={`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, '')}`}
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
