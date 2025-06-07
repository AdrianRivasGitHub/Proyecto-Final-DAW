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
import categoriaService from "@/services/categoriaService"
import regionService from "@/services/regionService"
import subcategoriaService from "@/services/subcategoriaService"
import ingredienteService from "@/services/ingredienteService"
import recetaService from "@/services/recetaService"

export default function DetalleReceta() {
  const [categorias, setCategorias] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);  
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
    const cargarDatos = async () => {
      await fetchRegiones();
      await fetchCategorias();
      await fetchSubcategorias();
      await fetchIngredientes();
      // if (isEditing) {
      //   // Cargar datos de la receta para editar
      //   await loadRecipeData(id);
      // }
    };    
    loadRecipeData();
    cargarDatos();
    console.log(receta);
  }, [id])

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

  const fetchSubcategorias = async () => {
    setIsLoading(true);
    try {
      setError(null); // Limpiar el mensaje de error
      const response = await subcategoriaService.getSubcategorias();
      setSubcategorias(response.data);
      console.log('Respuesta de la API:', response.data);
    } catch (error) {
      console.error('Error al obtener las subcategorías', error);
      setError('No se pudieron cargar las subcategorias. Inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false)
    }
  }

  const fetchIngredientes = async () => {
    setIsLoading(true);
    try {
      setError(null); // Limpiar el mensaje de error      
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

  const loadRecipeData = async () => {
    setIsLoading(true)
    setError("");
    try {
      const response = await recetaService.getRecetaById(id);
      const recetaData = response.data;
      const apiUrlBase = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
      console.log("Receta cargada:", recetaData);
      // Simulación de carga de datos
      await new Promise((resolve) => setTimeout(resolve, 500))

      // const mockReceta = {
      //   id_receta: Number.parseInt(id),
      //   nombre: "Ceviche de Conchas Negras",
      //   descripcion:
      //     "Ceviche tradicional con conchas negras frescas del norte del Perú, marinado en limón con ají limo y cebolla morada.",
      //   preparacion:
      //     "Lavar bien las conchas negras y extraer la carne. Cortar en trozos medianos. En un bowl, colocar la carne de conchas y cubrir completamente con jugo de limón fresco. Dejar marinar por 10-15 minutos hasta que la carne cambie de color. Mientras tanto, cortar la cebolla morada en juliana muy fina y el ají limo en brunoise. Agregar la cebolla y el ají a las conchas marinadas. Sazonar con sal y pimienta al gusto. Mezclar suavemente y dejar reposar 5 minutos más. Servir inmediatamente acompañado de camote sancochado, choclo y cancha serrana. Decorar con hojas de lechuga y culantro picado.",
      //   imagen_url: "/placeholder.svg?height=400&width=600",
      //   categoria: { id: 1, nombre: "Plato Principal" },
      //   region: { id: 1, nombre: "Costa Norte" },
      //   usuario: {
      //     id: 2,
      //     nombre: "María González",
      //     correo: "maria.gonzalez@email.com",
      //     rol: { nombre_rol: "Chef" },
      //   },
      //   created_at: "2024-01-15T10:30:00Z",
      //   updated_at: "2024-01-15T10:30:00Z",
      //   estado: "pendiente",
      //   subcategorias_receta: [
      //     { subcategoria: { id: 1, nombre: "Tradicional" } },
      //     { subcategoria: { id: 7, nombre: "Picante" } },
      //     { subcategoria: { id: 9, nombre: "Rápido" } },
      //   ],
      //   ingredientes_receta: [
      //     {
      //       id: 1,
      //       cantidad: "500",
      //       unidad: "gr",
      //       ingrediente: { id: 17, nombre: "Conchas negras", alergeno: { nombre: "Mariscos" } },
      //     },
      //     {
      //       id: 2,
      //       cantidad: "8",
      //       unidad: "unidad",
      //       ingrediente: { id: 2, nombre: "Limón", alergeno: null },
      //     },
      //     {
      //       id: 3,
      //       cantidad: "1",
      //       unidad: "unidad",
      //       ingrediente: { id: 3, nombre: "Cebolla morada", alergeno: null },
      //     },
      //     {
      //       id: 4,
      //       cantidad: "2",
      //       unidad: "unidad",
      //       ingrediente: { id: 4, nombre: "Ají limo", alergeno: null },
      //     },
      //     {
      //       id: 5,
      //       cantidad: "2",
      //       unidad: "unidad",
      //       ingrediente: { id: 5, nombre: "Camote", alergeno: null },
      //     },
      //     {
      //       id: 6,
      //       cantidad: "1",
      //       unidad: "unidad",
      //       ingrediente: { id: 6, nombre: "Choclo", alergeno: null },
      //     },
      //   ],
      //   tiempo_preparacion: "30 min",
      //   porciones: 4,
      //   dificultad: "Intermedio",
      //   calorias_estimadas: 180,
      // }

      setReceta({
        nombre: recetaData.nombre || "",
        descripcion: recetaData.descripcion || "",
        preparacion: recetaData.preparacion || "",
        imagen_url: recetaData.imagen_url ? `${apiUrlBase}${recetaData.imagen_url}` : "",
        imagenFile: null, // Se resetea al cargar, el usuario debe volver a subir si quiere cambiarla
        categoria_id: recetaData.categoria_id ? recetaData.categoria_id.toString() : "",
        region_id: recetaData.region_id ? recetaData.region_id.toString() : "",
        subcategorias: recetaData.subcategorias_receta ? recetaData.subcategorias_receta.map(sub => sub.subcategoria_id) : [],
        ingredientes: recetaData.ingredientes_receta ? recetaData.ingredientes_receta.map(ing => ({
          ingrediente_id: ing.ingrediente_id,
          nombre: ing.ingrediente.nombre,
          cantidad: ing.cantidad.toString(),
          unidad: ing.unidad,
          alergeno: ing.ingrediente.alergeno
        })) : [],
        usuario_id: recetaData.usuario_id ? recetaData.usuario_id : 1,
      });      
      //setReceta(mockReceta)
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
      borrador: { label: "Borrador", variant: "secondary" },
      pendiente: { label: "Pendiente", variant: "outline", className: "border-yellow-500 text-yellow-700" },
      rechazada: { label: "Rechazada", variant: "destructive" },
    }

    const config = statusConfig[estado] || statusConfig.borrador
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
      Administrador: { variant: "default", className: "bg-red-600" },
      Moderador: { variant: "default", className: "bg-blue-600" },
      Chef: { variant: "default", className: "bg-green-600" },
      Usuario: { variant: "secondary" },
    }

    const config = roleConfig[rol] || roleConfig.Usuario
    return (
      <Badge variant={config.variant} className={config.className}>
        {rol}
      </Badge>
    )
  }

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
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{receta.nombre}</h1>
                {getStatusBadge(receta.estado)}
              </div>
              <p className="text-gray-600">Detalle completo de la receta</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {receta.estado === "pendiente" && (
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
            )}
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
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Imagen de la Receta */}
            {receta.imagen_url && (
              <Card>
                <CardContent>
                  <img
                    src={receta.imagen_url || "/placeholder.svg"}
                    alt={receta.nombre}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Descripcion */}
            <Card>
              <CardHeader>
                <CardTitle>Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{receta.descripcion || "Sin descripción disponible"}</p>
              </CardContent>
            </Card>

            {/* Preparacion */}
            <Card>
              <CardHeader>
                <CardTitle>Preparación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {receta.preparacion || "Sin instrucciones de preparación disponibles"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Author Info */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Autor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg?height=64&width=64" />
                    <AvatarFallback>
                      {/* {receta.usuario.nombre
                        .split(" ")
                        .map((n) => n[0])
                        .join("")} */}
                        hola
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      {/* <h3 className="font-semibold text-lg">{receta.usuario.nombre}</h3>
                      {getRoleBadge(receta.usuario.rol.nombre_rol)} */}
                    </div>
                    {/* <p className="text-gray-600">{receta.usuario.correo}</p> */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Receta Info */}
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
                  <Badge variant="outline">{receta.categoria_id}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Región:</span>
                  <Badge className="bg-orange-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    {receta.region_id}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tiempo:</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{receta.tiempo_preparacion}</span>
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
                  <Badge variant="outline">{receta.dificultad}</Badge>
                </div>
                {receta.calorias_estimadas && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Calorías:</span>
                    <span className="font-semibold">{receta.calorias_estimadas} kcal</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ingredientes */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredientes ({receta.ingredientes.length})</CardTitle>
                <CardDescription>Para 4 porciones</CardDescription>
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

            {/* Subcategorias */}
            {receta.subcategorias.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Subcategorías</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {receta.subcategorias.map((subReceta) => (
                      <Badge key={subReceta.subcategoria_id} variant="secondary">
                        {subReceta.subcategoria_id}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Aprobar-Dialog */}
        <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
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
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
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
        </Dialog>

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
