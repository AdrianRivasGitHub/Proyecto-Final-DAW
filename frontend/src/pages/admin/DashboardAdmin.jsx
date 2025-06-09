import { React, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, Utensils, AlertCircle, CheckCircle } from "lucide-react"
import AdminLayout from "@/components/admin/AdminLayout"
import { Toaster } from "sonner" 
import recetaService from "@/services/recetaService"
import ingredienteService from "@/services/ingredienteService"
import subcategoriaService from "@/services/subcategoriaService"
import usuarioService from "@/services/usuarioService"

export default function DashboardAdmin() {
  const [recetas, setRecetas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);  
  const [ingredientes, setIngredientes] = useState([]);  
  const [subcategorias, setSubcategorias] = useState([]);    
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")  

  useEffect(() => {
    fetchRecetas();
    fetchUsuarios();
    fetchIngredientes();
    fetchSubcategorias();
  }, []);

  const fetchRecetas = async () => {
    setIsLoading(true);
    try {
      const response = await recetaService.getRecetas();
      setRecetas(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error al obtener las recetas', error);
      setError("Error de conexión");
    } finally {
      setIsLoading(false)
    }
  }  

  const fetchUsuarios = async () => {
    setIsLoading(true);
    try {
      const response = await usuarioService.getUsuarios();
      setUsuarios(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error al obtener los usuarios', error);
      setError("Error de conexión");
    } finally {
      setIsLoading(false)
    }    
  }  

  const fetchIngredientes = async () => {
    setIsLoading(true);
    try {
      const response = await ingredienteService.getIngredientes();
      setIngredientes(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error al obtener los ingredientes', error);
      setError("Error de conexión");
    } finally {
      setIsLoading(false)
    }    
  }  

  const fetchSubcategorias = async () => {
    setIsLoading(true);
    try {
      const response = await subcategoriaService.getSubcategorias();
      setSubcategorias(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error al obtener las subcategorías', error);
      setError("Error de conexión");
    } finally {
      setIsLoading(false)
    }    
  }    

  // Datos hardcodeados para las estadísticas
  const stats = [
    {
      title: "Total Usuarios",
      value: usuarios.length,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Recetas Publicadas",
      value: recetas.length,
      icon: BookOpen,
      color: "text-green-600",
    },
    {
      title: "Total Ingredientes",
      value: ingredientes.length,
      icon: Utensils,      
      color: "text-yellow-600",
    },
    {
      title: "Total Subcategorias",
      value: subcategorias.length,
      icon: AlertCircle,
      color: "text-orange-600",
    },
  ]

  // const recetasRecientes = [
  //   {
  //     id: 1,
  //     nombre: "Ceviche de Conchas Negras",
  //     usuario: { nombre: "María González", correo: "maria@email.com" },
  //     categoria: { nombre: "Entrada" },
  //     region: { nombre: "Costa" },
  //     created_at: "2024-01-15T10:30:00Z",
  //     estado: "pendiente",
  //   },
  //   {
  //     id: 2,
  //     nombre: "Rocoto Relleno Arequipeño",
  //     usuario: { nombre: "Carlos Mendoza", correo: "carlos@email.com" },
  //     categoria: { nombre: "Fondo" },
  //     region: { nombre: "Sierra" },
  //     created_at: "2024-01-14T15:45:00Z",
  //     estado: "publicada",
  //   },
  //   {
  //     id: 3,
  //     nombre: "Suspiro Limeño Tradicional",
  //     usuario: { nombre: "Ana Rodríguez", correo: "ana@email.com" },
  //     categoria: { nombre: "Postre" },
  //     region: { nombre: "Lima" },
  //     created_at: "2024-01-13T09:20:00Z",
  //     estado: "publicada",
  //   },
  //   {
  //     id: 4,
  //     nombre: "Juane de Pollo Selvático",
  //     usuario: { nombre: "Luis Vargas", correo: "luis@email.com" },
  //     categoria: { nombre: "Dondo" },
  //     region: { nombre: "Selva" },
  //     created_at: "2024-01-12T14:10:00Z",
  //     estado: "borrador",
  //   },
  // ]

  // Calcular las 5 subcategorías más usadas
  const subcatCount = {};
  recetas.forEach((receta) => {
    if (Array.isArray(receta.subcategorias_receta)) {
      receta.subcategorias_receta.forEach((sub) => {
        const nombre = sub.subcategoria?.nombre || sub.nombre;
        if (nombre) {
          subcatCount[nombre] = (subcatCount[nombre] || 0) + 1;
        }
      });
    }
  });
  const totalSubcatUsos = Object.values(subcatCount).reduce((a, b) => a + b, 0);
  const subcategoriasData = Object.entries(subcatCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nombre, total]) => ({
      nombre,
      total,
      porcentaje: totalSubcatUsos ? Math.round((total / totalSubcatUsos) * 100) : 0,
    }));

  // Calcular los 5 ingredientes más usados
  const ingCount = {};
  recetas.forEach((receta) => {
    if (Array.isArray(receta.ingredientes_receta)) {
      receta.ingredientes_receta.forEach((ing) => {
        const nombre = ing.ingrediente?.nombre || ing.nombre;
        if (nombre) {
          ingCount[nombre] = (ingCount[nombre] || 0) + 1;
        }
      });
    }
  });
  const totalIngUsos = Object.values(ingCount).reduce((a, b) => a + b, 0);
  const alergenosData = Object.entries(ingCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nombre, total]) => ({
      nombre,
      total,
      porcentaje: totalIngUsos ? Math.round((total / totalIngUsos) * 100) : 0,
    }));

  // const getStatusBadge = (estado) => {
  //   const statusConfig = {
  //     publicada: { label: "Publicada", variant: "default", className: "bg-green-600" },
  //     borrador: { label: "Borrador", variant: "secondary" },
  //     pendiente: { label: "Pendiente", variant: "outline", className: "border-yellow-500 text-yellow-700" },
  //   }

  //   const config = statusConfig[estado]
  //   return (
  //     <Badge variant={config.variant} className={config.className}>
  //       {config.label}
  //     </Badge>
  //   )
  // }

  const formatoDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Resumen general del sistema y actividad reciente</p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    {/* <p className={`text-sm ${stat.changeType === "increase" ? "text-green-600" : "text-red-600"}`}>
                      {stat.change} vs mes anterior
                    </p> */}
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recetas recientes */}
        {/* <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Últimas Recetas Añadidas</CardTitle>
                  <CardDescription>Recetas más recientes en el sistema</CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/admin/recetas">Ver Todas</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recetasRecientes.map((receta) => (
                  <div key={receta.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{receta.nombre}</h4>
                        {getStatusBadge(receta.estado)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>por {receta.usuario.nombre}</span>
                        <span>-</span>
                        <span>{receta.categoria.nombre}</span>
                        <span>-</span>
                        <span>{receta.region.nombre}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{formatoDate(receta.created_at)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/admin/recetas/${receta.id}`}>Ver</Link>
                      </Button>
                      {receta.estado === "pendiente" && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Aprobar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div> */}

        {/* Gráficas y Stats */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Acciones Rápidas*/}
          {/* <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-orange-600 hover:bg-orange-700" asChild>
                <Link to="/admin/recetas/nuevo">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Nueva Receta
                </Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/admin/usuarios">
                  <Users className="h-4 w-4 mr-2" />
                  Gestionar Usuarios
                </Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/admin/ingredientes">
                  <Utensils className="h-4 w-4 mr-2" />
                  Gestionar Ingredientes
                </Link>
              </Button>
            </CardContent>
          </Card> */}

          {/* Subcategorias */}
          <Card>
            <CardHeader>
              <CardTitle>Recetas por Subcategoría</CardTitle>
              <CardDescription>Distribución de recetas por tipo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {subcategoriasData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.nombre}</span>
                      <span className="text-gray-600">{item.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ingredientes */}
          <Card>
            <CardHeader>
              <CardTitle>Recetas por Ingredientes</CardTitle>
              <CardDescription>Distribución según ingredientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alergenosData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.nombre}</span>
                      <span className="text-gray-600">{item.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
