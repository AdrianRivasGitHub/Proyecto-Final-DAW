import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ChefHat, Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react"
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import authService from '@/services/authService';

export default function LoginPage() {
  const [identificador, setIdentificador] = useState("");
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await authService.login({
        identificador: identificador,
        contraseña: password
      });
      const { access_token, usuario } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      // Redirigir según el rol del usuario
      if (usuario && usuario.rol && usuario.rol.nombre_rol === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50">
      <Header />
      <div className="w-full max-w-md p-6 justify-self-center">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-600 p-3 rounded-full">
              <ChefHat className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Recetas</h1>
          <p className="text-gray-600">Inicia sesión en tu cuenta</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa los datos para acceder a tu cuenta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identificador">Nombre de Usuario o Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input id="identificador" type="text" placeholder="tu@email.com" className="pl-10" value={identificador} onChange={e => setIdentificador(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="*******" className="pl-10" value={password} onChange={e => setPassword(e.target.value)} required />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && <div className="text-red-600 text-sm text-center font-medium">{error}</div>}

              <Button className="w-full bg-orange-600 hover:bg-orange-700" type="submit" disabled={loading}>
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
            <div className="text-center text-sm">
              <span className="text-gray-600">¿No tienes una cuenta? </span>
              <Link to="/registro" className="text-orange-600 hover:underline font-medium">
                Regístrate aquí
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button variant="outline" asChild>
            <Link to="/" className="text-sm text-gray-600 hover:text-orange-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
