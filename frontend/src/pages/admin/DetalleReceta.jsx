import { React, useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Textarea } from "../../components/ui/textarea"
import { toast } from "sonner"
import {
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  MapPin,
  Calendar,
  User,
  AlertTriangle,
  MessageSquare,
  Eye,
  Share2,
} from "lucide-react"
import AdminLayout from '@/components/admin/AdminLayout'
import recetaService from "@/services/recetaService"

export default function DetalleReceta() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [receta, setReceta] = useState(null)
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadRecipeData();
    console.log(receta);
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
        estado: recetaData.usuario.rol.nombre_rol === "Admin" ? "publicada" : "pendiente",
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

  const getStatusBadge = (estado) => {
    const statusConfig = {
      publicada: { label: "Publicada", variant: "default", className: "bg-green-600" },
      pendiente: { label: "Pendiente", variant: "outline", className: "border-yellow-500 text-yellow-700" },
      rechazada: { label: "Rechazada", variant: "destructive" },
    }

    const config = statusConfig[estado] || statusConfig.pendiente
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
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

  const usuarioActual = (() => {
    try {
      const datos = localStorage.getItem('usuario');
      return datos ? JSON.parse(datos) : null;
    } catch {
      return null;
    }
  })();

  const handleApprove = async () => {
    try {
      console.log("Aprobando receta:", id)
      // llamada a la API
      setReceta({ ...receta, estado: "publicada" })
      setIsApprovalDialogOpen(false)
    } catch (error) {
      console.error("Error al aprobar:", error)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Debe proporcionar una razón para el rechazo")
      return
    }

    try {
      console.log("Rechazando receta:", id, "Razón:", rejectReason)
      // llamada a la API
      setReceta({ ...receta, estado: "rechazada" })
      setIsRejectDialogOpen(false)
      setRejectReason("")
    } catch (error) {
      console.error("Error al rechazar:", error)
    }
  }

  const handleDelete = async () => {
    try {
      console.log("Eliminando receta:", id)
      // llamada a la API
      setIsDeleteDialogOpen(false)
      navigate("/admin/recetas")
    } catch (error) {
      console.error("Error al eliminar:", error)
    }
  }

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
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link to="/admin/recetas">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Recetas
              </Link>
            </Button>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{receta.nombre}</h1>
                {getStatusBadge(receta.estado)}
              </div>
              <p className="text-gray-600">Detalle completo de la receta</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* {receta.estado === "pendiente" && (
              <>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsApprovalDialogOpen(true)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aprobar
                </Button>
                <Button variant="destructive" onClick={() => setIsRejectDialogOpen(true)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Rechazar
                </Button>
              </>
            )} */}
            {usuarioActual && receta.usuario_id === usuarioActual.id_usuario && (
              <>
                <Button variant="outline" asChild>
                  <Link to={`/admin/recetas/${id}/editar`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Link>
                </Button>
                <Button variant="outline" className="text-red-600" onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </>
            )}
          </div>
        </div>

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
                  <span className="text-gray-600">ID:</span>
                  <Badge variant="outline">#{receta.id_receta}</Badge>
                </div>
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

        {/* Aprobar-Dialog */}
        {/* <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Aprobar Receta</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que quieres aprobar esta receta? Una vez aprobada, será visible para todos los usuarios.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                Aprobar Receta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}

        {/* Reject Dialog */}
        {/* <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rechazar Receta</DialogTitle>
              <DialogDescription>
                Proporciona una razón para el rechazo. Esta información será enviada al autor.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Explica por qué se rechaza esta receta..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                Rechazar Receta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar Receta</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que quieres eliminar esta receta? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Eliminar Receta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}