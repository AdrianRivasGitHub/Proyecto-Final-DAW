import React, { useEffect, useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom"
import { ChefHat, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LogOut,
  Settings,
  User,
} from "lucide-react"

export default function Header() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const datosUsuarioGuardados = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    if (datosUsuarioGuardados && token) {
      setUsuario(JSON.parse(datosUsuarioGuardados));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token
    localStorage.removeItem('usuario'); // Elimina datos de usuario
    setUsuario(null);
    navigate('/'); // Redirige al Home
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 justify-center sm:justify-between">
            <Link to="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <ChefHat className="h-8 w-8 text-orange-600" />
                <h1 className="text-2xl font-bold text-gray-900">Recetas</h1>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-orange-600 font-medium">
                Inicio
              </Link>
              <Link to="/recetas" className="text-gray-700 hover:text-orange-600 font-medium">
                Explorar
              </Link>
              {usuario && usuario.rol && (
                <Link to="/favoritos" className="text-gray-700 hover:text-orange-600 font-medium">
                  Favoritos
                </Link>
              )}
              {/* <Link to="/que-cocino" className="text-gray-700 hover:text-orange-600 font-medium">
              ¿Qué cocino hoy?
            </Link> */}
              <Link to="/blog" className="text-gray-700 hover:text-orange-600 font-medium">
                Blog
              </Link>
            </nav>

            {usuario && usuario.rol.nombre_rol === 'Admin' && (
              <Button variant="outline" asChild>
                <Link to="/admin">
                  <Globe className="h-4 w-4 mr-2" />
                  Ir a Panel Admin
                </Link>
              </Button>
            )}

            {usuario ? (
              <div className="flex items-center space-x-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt={usuario.nombre} />
                        <AvatarFallback>{usuario.nombre.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {/* <span className="font-medium">{usuario.nombre}</span> */}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{usuario.nombre}</p>
                        <p className="text-xs leading-none text-muted-foreground">{usuario.rol.nombre_rol}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* <DropdownMenuItem asChild>
                      <Link to="/dashboard/perfil">
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/config">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Configuración</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator /> */}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="outline" asChild>
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
                <Button className="bg-orange-600 hover:bg-orange-700" asChild>
                  <Link to="/registro">Registrarse</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden bg-white border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex space-x-1 overflow-x-auto md:justify-center justify-self-center">
            <Link to="/" className="flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors">
              Inicio
            </Link>
            <Link to="/recetas" className="flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors">
              Explorar
            </Link>
              {usuario && usuario.rol && (            
            <Link to="/favoritos" className="flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors">
              Favoritos
            </Link>
              )}
            {/* <Link to="/que-cocino" className="flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors">
              ¿Qué cocino hoy?
            </Link> */}
            <Link to="/blog" className="flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors">
              Blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}