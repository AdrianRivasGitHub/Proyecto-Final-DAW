import React, { useEffect, useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
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
  Shield,
  LayoutDashboard,
  Users,
  BookOpen,
  Utensils,
  Tags,
  ShoppingCart,
  Globe,
  LogOut,
  Settings,
  User,
} from "lucide-react"
import { Toaster } from "sonner"

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const datosUsuarioGuardados = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    if (datosUsuarioGuardados && token) {
      setUsuario(JSON.parse(datosUsuarioGuardados));
    }
  }, []);

  useEffect(() => {
    console.log("Usuario en AdminLayout:", usuario);
  }, [usuario]); // Se ejecuta cada vez que 'usuario' cambia

  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token
    localStorage.removeItem('usuario'); // Elimina datos de usuario
    setUsuario(null);
    navigate('/'); // Redirige al Home
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current: location.pathname === "/admin",
    },
    {
      name: "Usuarios",
      href: "/admin/usuarios",
      icon: Users,
      current: location.pathname.startsWith("/admin/usuarios"),
    },
    {
      name: "Recetas",
      href: "/admin/recetas",
      icon: BookOpen,
      current: location.pathname.startsWith("/admin/recetas"),
    },
    {
      name: "Ingredientes",
      href: "/admin/ingredientes",
      icon: Utensils,
      current: location.pathname.startsWith("/admin/ingredientes"),
    },
    {
      name: "Subcategorías",
      href: "/admin/subcategorias",
      icon: Tags,
      current: location.pathname.startsWith("/admin/subcategorias"),
    },
    // {
    //   name: "Planificación",
    //   href: "/admin/planificacion",
    //   icon: ShoppingCart,
    //   current: location.pathname.startsWith("/admin/planificacion"),
    // },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 justify-center sm:justify-between">
            <Link to="/admin">
              <div className="flex items-center space-x-2 cursor-pointer">
                <Shield className="h-8 w-8 text-orange-600" />
                <h1 className="text-xl font-bold text-gray-900">Panel Administrativo</h1>
              </div>
            </Link>

            {/* Nav */}
            <nav className="hidden xl:flex items-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${item.current
                      ? "bg-orange-100 text-orange-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/">
                  <Globe className="h-4 w-4 mr-2" />
                  Ver Sitio Web
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt={usuario?.nombre || 'Admin'} />
                      <AvatarFallback>{usuario?.nombre?.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    {usuario ? (
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{usuario.nombre}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {/* Asegurarse que usuario.rol también exista */}
                          {usuario.rol ? usuario.rol.nombre_rol : "Rol no definido"}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Cargando...</p>
                        <p className="text-xs leading-none text-muted-foreground">...</p>
                      </div>
                    )}
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
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="xl:hidden bg-white border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex space-x-1 overflow-x-auto md:justify-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${item.current ? "bg-orange-100 text-orange-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">{children}</main>
      <Toaster richColors position="top-right" />
    </div>
  )
}
