import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Users,
  BookOpen,
  TrendingUp,
  Eye,
  MessageSquare,
  Shield,
  Settings,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Edit,
  Star,
} from "lucide-react"

export default function PanelAdmin() {
  const pendingRecipes = [
    {
      id: 1,
      title: "Ceviche de Conchas Negras",
      author: "María González",
      submitted: "2024-01-15",
      status: "pending",
      image: "/placeholder.svg?height=60&width=80",
    },
    {
      id: 2,
      title: "Rocoto Relleno Arequipeño",
      author: "Carlos Mendoza",
      submitted: "2024-01-14",
      status: "pending",
      image: "/placeholder.svg?height=60&width=80",
    },
  ]

  const recentUsers = [
    {
      id: 1,
      name: "Ana Rodríguez",
      email: "ana@email.com",
      joined: "2024-01-15",
      recipes: 3,
      status: "active",
    },
    {
      id: 2,
      name: "Luis Vargas",
      email: "luis@email.com",
      joined: "2024-01-14",
      recipes: 1,
      status: "active",
    },
  ]

  const stats = [
    { title: "Total Usuarios", value: "2,847", change: "+12%", icon: Users },
    { title: "Recetas Publicadas", value: "1,234", change: "+8%", icon: BookOpen },
    { title: "Vistas del Mes", value: "45,678", change: "+23%", icon: Eye },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/">Ver Sitio Web</Link>
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span className="font-medium">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change} vs mes anterior</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="recetas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recetas">Gestión de Recetas</TabsTrigger>
            <TabsTrigger value="usuarios">Gestión de Usuarios</TabsTrigger>
            <TabsTrigger value="categorias">Categorías</TabsTrigger>
            <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          </TabsList>

          {/* Recipe Management */}
          <TabsContent value="recetas">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recetas Pendientes de Aprobación</CardTitle>
                    <CardDescription>Revisa y aprueba las recetas enviadas por los usuarios</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingRecipes.map((recipe) => (
                        <div key={recipe.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <img
                            src={recipe.image || "/placeholder.svg"}
                            alt={recipe.title}
                            width={80}
                            height={60}
                            className="rounded-md object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{recipe.title}</h4>
                            <p className="text-sm text-gray-600">por {recipe.author}</p>
                            <p className="text-xs text-gray-500">Enviado el {recipe.submitted}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprobar
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            <Button size="sm" variant="destructive">
                              <XCircle className="h-4 w-4 mr-1" />
                              Rechazar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Acciones Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Ver Todas las Recetas
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurar Moderación
                    </Button>
                    <Button className="w-full" variant="outline">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Recetas Destacadas
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="usuarios">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Usuarios</CardTitle>
                    <CardDescription>Administra las cuentas de usuario</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input placeholder="Buscar usuarios..." className="pl-10 w-64" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span>Unido: {user.joined}</span>
                            <span>{user.recipes} recetas</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.status === "active" ? "default" : "secondary"}>
                          {user.status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Management */}
          <TabsContent value="categorias">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Categorías</CardTitle>
                <CardDescription>Administra las categorías y subcategorías de recetas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-4">Categorías Principales</h3>
                    <div className="space-y-2">
                      {["Platos de Fondo", "Entradas", "Postres", "Bebidas"].map((category, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <span>{category}</span>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-4">Etiquetas Dietéticas</h3>
                    <div className="space-y-2">
                      {["Vegano", "Vegetariano", "Sin Gluten", "Sin Lactosa"].map((tag, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <span>{tag}</span>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics */}
          <TabsContent value="estadisticas">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recetas Más Vistas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Ceviche Clásico", views: 2847 },
                      { name: "Lomo Saltado", views: 2156 },
                      { name: "Ají de Gallina", views: 1923 },
                      { name: "Anticuchos", views: 1654 },
                      { name: "Causa Limeña", views: 1432 },
                    ].map((recipe, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{recipe.name}</span>
                        <Badge variant="outline">{recipe.views.toLocaleString()} vistas</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usuarios Más Activos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Chef María", recipes: 23, rating: 4.9 },
                      { name: "Carlos Mendoza", recipes: 18, rating: 4.7 },
                      { name: "Ana Rodríguez", recipes: 15, rating: 4.8 },
                      { name: "Luis Vargas", recipes: 12, rating: 4.6 },
                      { name: "Sofia Torres", recipes: 10, rating: 4.5 },
                    ].map((user, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{user.name}</span>
                          <p className="text-sm text-gray-600">{user.recipes} recetas</p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                          <span>{user.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
