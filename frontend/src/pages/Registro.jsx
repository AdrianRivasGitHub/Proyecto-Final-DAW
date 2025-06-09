import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ChefHat, Mail, Lock, ArrowLeft, User, Eye, EyeOff } from "lucide-react"
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import authService from '@/services/authService';

export default function RegistroPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false)  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await authService.registro({
        nombre: nombre,
        correo: email,
        contraseña: password
      });
      const { access_token, usuario } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al registrar el usuario');
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
          <p className="text-gray-600">Registra una nueva cuenta</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registro</CardTitle>
            <CardDescription>Rellena los campos para crear tu cuenta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleRegistro} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de Usuario</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input id="nombre" type="text" placeholder="Tu nombre de usuario" className="pl-10" value={nombre} onChange={e => setNombre(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input id="email" type="email" placeholder="tu@email.com" className="pl-10" value={email} onChange={e => setEmail(e.target.value)} required />
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

              {error && <div className="text-red-600 text-sm text-center">{error}</div>}

              <Button className="w-full bg-orange-600 hover:bg-orange-700" type="submit" disabled={loading}>
                {loading ? ' Registrando...' : 'Crear cuenta'}
              </Button>
            </form>
            <div className="text-center text-sm">
              <span className="text-gray-600">Ya tienes una cuenta? </span>
              <Link to="/login" className="text-orange-600 hover:underline font-medium">
                Inicia sesión
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
