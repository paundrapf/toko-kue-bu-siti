import { useState } from 'react';
import { Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface AdminLoginViewProps {
  onLogin: (username: string, password: string) => boolean;
  onBack: () => void;
}

export function AdminLoginView({ onLogin, onBack }: AdminLoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Mohon isi username dan password');
      return;
    }

    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      const success = onLogin(username, password);
      if (!success) {
        toast.error('Username atau password salah');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-[#FF6B9D] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Website
        </button>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-[#FF6B9D] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <p className="text-gray-500 text-sm mt-2">
              Masuk ke panel admin Toko Kue Bu Siti
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#FF6B9D] hover:bg-[#E85A8A] py-6"
                disabled={isLoading}
              >
                {isLoading ? 'Memuat...' : 'Masuk'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Demo Login:</strong>
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Username: <code className="bg-amber-100 px-2 py-0.5 rounded">admin</code>
              </p>
              <p className="text-sm text-amber-700">
                Password: <code className="bg-amber-100 px-2 py-0.5 rounded">admin123</code>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          &copy; {new Date().getFullYear()} Toko Kue Bu Siti. All rights reserved.
        </p>
      </div>
    </div>
  );
}
