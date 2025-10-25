import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Button } from './ui/button';
import { ShoppingBag, Store, User, LogOut, Home } from 'lucide-react';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-yellow-600" />
            <span className="text-2xl font-bold text-gray-900">JEWELIA</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-yellow-600">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-yellow-600">
              Products
            </Link>
            <Link to="/shops" className="text-gray-700 hover:text-yellow-600">
              Shops
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'shop_owner' && (
                  <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-yellow-600">
                    <Store className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                )}
                <Link to="/orders" className="text-gray-700 hover:text-yellow-600">
                  Orders
                </Link>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-700" />
                  <span className="text-gray-700">{user?.name}</span>
                </div>
                <Button onClick={logout} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
