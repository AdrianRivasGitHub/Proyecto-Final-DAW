import { React, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Search, Plus, Eye, Edit, Trash2, CheckCircle, XCircle, MapPin, User, Calendar } from "lucide-react"
import AdminLayout from '@/components/admin/AdminLayout'
import recetaService from "@/services/recetaService"
import categoriaService from "@/services/categoriaService"
import regionService from "@/services/regionService"

export default function ListaRecetas() {
  const [recetas, setRecetas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategoria, setFilterCategoria] = useState("all")
  const [filterRegion, setFilterRegion] = useState("all")
  const [filterEstado, setFilterEstado] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchRecetas();
    fetchCategorias();
    fetchRegiones();
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

  const fetchCategorias = async () => {
    setIsLoading(true);
    try {
      setError(null); // Limpiar el mensaje de error
      const response = await categoriaService.getCategorias();
      setCategorias(response.data);
      console.log('Respuesta de la API:', response.data);
    } catch (error) {
      console.error('Error al cargar categorias:', error);
      setError('No se pudieron cargar las cateegorias. Inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false)
    }
  };

  const fetchRegiones = async () => {
    setIsLoading(true);
    try {
      setError(null); // Limpiar el mensaje de error
      const response = await regionService.getRegiones();
      setRegiones(response.data);
      console.log('Respuesta de la API:', response.data);
    } catch (error) {
      console.error('Error al cargar regiones:', error);
      setError('No se pudieron cargar las regiones. Inténtalo de nuevo más tarde.');
    }
    setIsLoading(false);
  }; 

  const recetasPublicadas = recetas.filter((r) => r.usuario.rol.nombre_rol === "Admin")
  const recetasPendientes = recetas.filter((r) => r.usuario.rol.nombre_rol === "Usuario")

  const stats = {
    total: recetas.length,
    publicadas: recetasPublicadas.length,
    pendientes: recetasPendientes.length,
  }

  const filterRecipes = (recipes) => {
    return recipes.filter((receta) => {
      const matchesSearch =
        receta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receta.usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategoria = filterCategoria === "all" || receta.categoria.nombre === filterCategoria
      const matchesRegion = filterRegion === "all" || receta.region.nombre === filterRegion

      return matchesSearch && matchesCategoria && matchesRegion
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // const handleApprove = (recetaId) => {
  //   console.log("Aprobando receta:", recetaId)
  // }

  // const handleReject = (recetaId) => {
  //   console.log("Rechazando receta:", recetaId)
  // }

  const handleDelete = async (recetaId) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta receta?")) return

    try {
      const response = await recetaService.deleteReceta(recetaId);

      if(response.status === 204){
        fetchRecetas()
        toast.success("¡Éxito!", {
          description: "La receta ha sido eliminada correctamente.",
        });
      }

    } catch (error) {
      let errorMessage = "Ocurrió un error al eliminar la receta.";
      if (error.response) {
        console.error("Error Server responded:", error.response.data);
        setError(error.response.data.message || "Error del servidor al eliminar la receta");
        errorMessage = error.response.data.message || "No se pudo eliminar la receta.";
      } else {
        console.error("Error Request setup:", error.message);
        setError("Error de conexión o configuración al eliminar la receta");
      }
    }        
    console.log("Eliminando receta:", recetaId)
  }  

  const RecipeTable = ({ recipes, showActions = true, isPending = false }) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 font-medium">ID</th>
            <th className="text-left p-4 font-medium">Nombre</th>
            <th className="text-left p-4 font-medium">Región</th>
            <th className="text-left p-4 font-medium">Categoría</th>
            <th className="text-left p-4 font-medium">Fecha</th>
            <th className="text-left p-4 font-medium">Creado por</th>
            {showActions && <th className="text-left p-4 font-medium">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {recipes.map((receta) => (
            <tr key={receta.id_receta} className="border-b hover:bg-gray-50">
              <td className="p-4">
                <Badge variant="outline">#{receta.id_receta}</Badge>
              </td>
              <td className="p-4">
                <div>
                  <h4 className="font-medium">{receta.nombre}</h4>
                  <p className="text-sm text-gray-600 truncate max-w-xs">{receta.descripcion}</p>
                </div>
              </td>
              <td className="p-4">
                <Badge className="bg-orange-600">
                  <MapPin className="h-3 w-3 mr-1" />
                  {receta.region.nombre}
                </Badge>
              </td>
              <td className="p-4">
                <Badge variant="outline">{receta.categoria.nombre}</Badge>
              </td>
              <td className="p-4">
                <div className="text-sm">
                  <div>{formatDate(receta.created_at)}</div>
                  {receta.updated_at !== receta.created_at && (
                    <div className="text-gray-500">Act: {formatDate(receta.updated_at)}</div>
                  )}
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center">
                  <User className="h-6 w-6 mr-1 text-gray-500" />
                  <span className="text-sm">{receta.usuario.nombre}</span>
                </div>
              </td>
              {showActions && (
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/admin/recetas/${receta.id_receta}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/admin/recetas/${receta.id_receta}/editar`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    {isPending && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(receta.id_receta)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(receta.id_receta)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                      onClick={() => handleDelete(receta.id_receta)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Recetas</h1>
            <p className="text-gray-600">Administra todas las recetas del sistema</p>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700" asChild>
            <Link to="/admin/recetas/nuevo">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Receta
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Recetas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.publicadas}</p>
              <p className="text-sm text-gray-600">Publicadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.pendientes}</p>
              <p className="text-sm text-gray-600">Pendientes</p>
            </CardContent>
          </Card>
          {/* <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-600">{stats.borradores}</p>
              <p className="text-sm text-gray-600">Borradores</p>
            </CardContent>
          </Card> */}
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="p-6">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar recetas o autores..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.id_categoria} value={categoria.nombre}>
                      {categoria.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterRegion} onValueChange={setFilterRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Región" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las regiones</SelectItem>
                  {regiones.map((region) => (
                    <SelectItem key={region.id_region} value={region.nombre}>
                      {region.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Más Recientes</SelectItem>
                  <SelectItem value="name">Nombre A-Z</SelectItem>
                  <SelectItem value="author">Por Autor</SelectItem>
                  <SelectItem value="category">Por Categoría</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
          </CardContent>
        </Card>

        {/* Tabla para publicadas y pendientes */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <Tabs defaultValue="publicadas" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="publicadas">Recetas Publicadas ({recetasPublicadas.length})</TabsTrigger>
              <TabsTrigger value="pendientes">Pendientes de Aprobación ({recetasPendientes.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="publicadas">
              <Card>
                <CardHeader>
                  <CardTitle>Recetas Publicadas</CardTitle>
                  <CardDescription>Recetas que están actualmente visibles para los usuarios</CardDescription>
                </CardHeader>
                <CardContent>
                  {filterRecipes(recetasPublicadas).length === 0 && !isLoading ? (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron recetas publicadas</h3>                    
                      <p className="text-gray-600">Intenta cambiar el filtro de búsqueda</p>
                    </div>
                  ) : (
                    <RecipeTable recipes={filterRecipes(recetasPublicadas)} isPending={false} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pendientes">
              <Card>
                <CardHeader>
                  <CardTitle>Recetas Pendientes de Aprobación</CardTitle>
                  <CardDescription>Recetas enviadas por usuarios que requieren revisión</CardDescription>
                </CardHeader>
                <CardContent>
                  {filterRecipes(recetasPendientes).length === 0  && !isLoading ? (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron recetas pendientes</h3>                    
                      {/* <p className="text-gray-600">Intenta cambiar el filtro de búsqueda</p> */}
                    </div>
                  ) : (
                    <RecipeTable recipes={filterRecipes(recetasPendientes)} isPending={true} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AdminLayout>
  )
}
