import { React, useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { toast } from "sonner"
import {
  Clock,
  Users,
  ChefHat,
  Heart,
  Share2,
  Star,
  MapPin,
  ArrowLeft,
  Edit,
  Trash2,
  Bookmark,
  MessageCircle,
  ThumbsUp,
  Calendar,
  AlertTriangle,
} from "lucide-react"
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { Toaster } from "sonner"
import recetaService from "@/services/recetaService"
import favoritoService from "@/services/favoritoService"

export default function DetalleReceta() {
  const [usuario, setUsuario] = useState(null);
  const { id } = useParams()
  const navigate = useNavigate()
  const [receta, setReceta] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [idFavorito, setIdFavorito] = useState(null);

  useEffect(() => {
    const datosUsuarioGuardados = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    if (datosUsuarioGuardados && token) {
      setUsuario(JSON.parse(datosUsuarioGuardados));
    }
    loadRecipeData();
    // Consultar si la receta está en favoritos para el usuario actual
    if (datosUsuarioGuardados && token) {
      const user = JSON.parse(datosUsuarioGuardados);
      favoritoService.obtenerFavoritos(user.id_usuario)
        .then(res => {
          const fav = res.data.find(f => f.receta_id === Number(id));
          if (fav) {
            setIsFavorite(true);
            setIdFavorito(fav.id_favorito);
          } else {
            setIsFavorite(false);
            setIdFavorito(null);
          }
        })
        .catch(() => {
          setIsFavorite(false);
          setIdFavorito(null);
        });
    }
    // ...existing code...
  }, [id])

  const loadRecipeData = async () => {
    setIsLoading(true)
    setError("");
    try {
      const response = await recetaService.getRecetaById(id);
      const recetaData = response.data;
      const apiUrlBase = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
      console.log("Receta cargada:", recetaData);
      await new Promise((resolve) => setTimeout(resolve, 500))

      const tiempos = [15, 30, 45, 60];
      const dificultades = ["Fácil", "Media", "Difícil", "Experta"];
      const tiempoRandom = tiempos[Math.floor(Math.random() * tiempos.length)];
      const dificultadRandom = dificultades[Math.floor(Math.random() * dificultades.length)];

      setReceta({
        id_receta: recetaData.id_receta,
        nombre: recetaData.nombre || "",
        descripcion: recetaData.descripcion || "",
        preparacion: recetaData.preparacion || "",
        imagen_url: recetaData.imagen_url ? `${apiUrlBase}${recetaData.imagen_url}` : "",
        imagenFile: null, // Se resetea al cargar, el usuario debe volver a subir si quiere cambiarla
        categoria: recetaData.categoria,
        region: recetaData.region,
        categoria_id: recetaData.categoria_id ? recetaData.categoria_id.toString() : "",
        region_id: recetaData.region_id ? recetaData.region_id.toString() : "",
        subcategorias: recetaData.subcategorias_receta ? recetaData.subcategorias_receta : [],
        ingredientes: recetaData.ingredientes_receta ? recetaData.ingredientes_receta.map(ing => ({
          ingrediente_id: ing.ingrediente_id,
          nombre: ing.ingrediente.nombre,
          cantidad: ing.cantidad.toString(),
          unidad: ing.unidad,
          alergeno: ing.ingrediente.alergeno
        })) : [],
        usuario: recetaData.usuario,
        usuario_id: recetaData.usuario_id ? recetaData.usuario_id : 1,
        tiempo_preparacion: recetaData.tiempo || `${tiempoRandom} min`,
        porciones: recetaData.porciones || 4,
        dificultad: recetaData.dificultad || dificultadRandom,
        created_at: recetaData.created_at,
        updated_at: recetaData.updated_at,
      });
    } catch (error) {
      console.error("Error cargando receta:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getAlergenoBadge = (alergeno) => {
    if (!alergeno) return null
    return (
      <Badge variant="outline" className="text-xs text-red-600 border-red-300">
        <AlertTriangle className="h-3 w-3 mr-1" />
        {alergeno.nombre}
      </Badge>
    )
  }

  const getRoleBadge = (rol) => {
    const roleConfig = {
      Admin: { variant: "default", className: "bg-red-600" },
      Moderador: { variant: "default", className: "bg-blue-600" },
      Usuario: { variant: "secondary" },
    }

    const config = roleConfig[rol] || roleConfig.Usuario
    return (
      <Badge variant={config.variant} className={config.className}>
        {rol}
      </Badge>
    )
  }

  const handleToggleFavorito = async () => {
    if (!usuario) return;
    if (isFavorite && idFavorito) {
      // Eliminar de favoritos
      try {
        await favoritoService.eliminarFavorito(idFavorito);
        setIsFavorite(false);
        setIdFavorito(null);
        toast.success('Receta eliminada de favoritos');
      } catch {
        toast.error('No se pudo eliminar de favoritos');
      }
    } else {
      // Agregar a favoritos
      try {
        const res = await favoritoService.agregarFavorito({ usuario_id: usuario.id_usuario, receta_id: Number(id) });
        setIsFavorite(true);
        setIdFavorito(res.data.id_favorito);
        toast.success('Receta agregada a favoritos');
      } catch (err) {
        if (err.response && err.response.status === 409) {
          toast.error('La receta ya está en favoritos');
        } else {
          toast.error('No se pudo agregar a favoritos');
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando receta...</p>
        </div>
      </div>
    )
  }

  if (!receta) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Receta no encontrada</h2>
        <p className="text-gray-600 mb-4">La receta que buscas no existe o ha sido eliminada.</p>
        <Button asChild>
          <Link to="/admin/recetas">Volver a Recetas</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="space-y-8 p-6">
      <Toaster richColors position="top-right" />
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <Button variant="outline" asChild>
              <Link to="/recetas">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Recetas
              </Link>
            </Button>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{receta.nombre}</h1>
              </div>
              <p className="text-gray-600">Detalle completo de la receta</p>
            </div>
          </div>

          {usuario && usuario.rol && (
            <div className="hidden lg:flex items-center space-x-3 mb-8">
              <Button
                variant={isFavorite ? "default" : "outline"}
                onClick={handleToggleFavorito}
                className={isFavorite ? "bg-red-600 hover:bg-red-700" : ""}
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                {isFavorite ? "En Favoritos" : "Agregar a Favoritos"}
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </div>
          )}
        </div>

        {/* Versión para móviles*/}
        {usuario && usuario.rol && (
          <div className="flex lg:hidden items-center space-x-3 mb-8 mt-4">
            <Button
              variant={isFavorite ? "default" : "outline"}
              onClick={handleToggleFavorito}
              className={isFavorite ? "bg-red-600 hover:bg-red-700" : ""}
            >
              <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? "En Favoritos" : "Agregar a Favoritos"}
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Imagen de la Receta */}
          {receta.imagen_url && (
            <div className="order-1 lg:col-span-2 lg:order-none">
              <Card>
                <CardContent>
                  <img
                    src={receta.imagen_url || "/placeholder.svg"}
                    alt={receta.nombre}
                    className="w-full h-96 rounded-lg"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Información de la Receta (Sidebar) */}
          <div className="order-2 lg:col-span-1 lg:order-none space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Receta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Categoría:</span>
                  <Badge variant="outline">{receta.categoria.nombre}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Región:</span>
                  <Badge className="bg-orange-600">
                    <MapPin className="h-3 w-3" />
                    {receta.region.nombre}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tiempo:</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{receta.tiempo_preparacion} min</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Porciones:</span>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{receta.porciones}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Dificultad:</span>
                  <Badge className="text-sm" variant="secondary">{receta.dificultad}</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{receta.descripcion || "Sin descripción disponible"}</p>
              </CardContent>
            </Card>
          </div>

          {/* Ingredientes (Main) */}
          <div className="order-4 lg:col-span-2 lg:order-none space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Ingredientes ({receta.ingredientes.length})</CardTitle>
                <CardDescription>Para {receta.porciones} porciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {receta.ingredientes.map((ingredienteReceta) => (
                    <div key={ingredienteReceta.ingrediente_id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <span className="font-medium pr-2">{ingredienteReceta.nombre}</span>
                        {getAlergenoBadge(ingredienteReceta.alergeno)}
                      </div>
                      <span className="text-orange-600 font-semibold">
                        {ingredienteReceta.cantidad} {ingredienteReceta.unidad}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Preparación */}
            <Card>
              <CardHeader>
                <CardTitle>Preparación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {receta.preparacion || "Sin instrucciones de preparación por ahora."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subcategorías y Autor (Sidebar) */}
          <div className="order-6 lg:col-span-1 lg:order-none space-y-6">
            {receta.subcategorias.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Subcategorías</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {receta.subcategorias.map((subReceta) => (
                      <Badge key={subReceta.id} variant="secondary">
                        {subReceta.subcategoria.nombre}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Información del Autor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    {/* <AvatarImage src="/placeholder.svg?height=64&width=64" /> */}
                    <AvatarFallback>
                      {receta.usuario.nombre
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-lg">{receta.usuario.nombre}</h3>
                      {getRoleBadge(receta.usuario.rol.nombre_rol)}
                    </div>
                    <p className="text-gray-600">{receta.usuario.correo}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2 lg:flex-col lg:items-start lg:space-x-0 lg:space-y-0">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Creado: {formatDate(receta.created_at)}
                      </div>
                      {receta.updated_at !== receta.created_at && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Actualizado: {formatDate(receta.updated_at)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
