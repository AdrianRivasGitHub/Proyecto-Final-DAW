import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Plus, Edit, Trash2, Calendar, Tag } from "lucide-react"
import { toast } from "sonner"
import AdminLayout from "@/components/admin/AdminLayout"
import subcategoriaService from "@/services/subcategoriaService"

export default function ListaSubcategorias() {
  const [subcategorias, setSubcategorias] = useState([]);  
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")  
  const [editingSubcategoria, setEditingSubcategoria] = useState(null)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  })

  useEffect(() => {
   fetchSubcategorias();
  }, []);    

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

  const handleNew = async () => {
    setEditingSubcategoria(null)
    setFormData({
      nombre: "",
      descripcion: "",
    })
    setIsDialogOpen(true)
  }

  const handleEdit = async (subcategoria) => {
    setEditingSubcategoria(subcategoria)
    setFormData({
      nombre: subcategoria.nombre,
      descripcion: subcategoria.descripcion || "",
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.nombre) {
      setError("Por favor ingrese un nombre para la subcategoría")
      return
    }

    try {
      let response;
      if (editingSubcategoria) {
        response = await subcategoriaService.updateSubcategoria(editingSubcategoria.id_subcategoria, formData);
      } else {
        response = await subcategoriaService.createSubcategoria(formData);
      }

      if (response.status === 200 || response.status === 201) {
        setIsDialogOpen(false);
        setEditingSubcategoria(null);
        setError("");
        console.log("Guardando subcategoría:", formData)
        fetchSubcategorias();
        toast.success(editingSubcategoria ? "¡Subcategoría actualizada!" : "¡Subcategoría creada!", {
          description: editingSubcategoria
            ? "La subcategoría ha sido actualizada correctamente."
            : "La subcategoría ha sido creada correctamente.",
        });
      } else {
        setError("Error al guardar la subcategoría");
        toast.error("Error", {
          description: "No se pudo guardar la subcategoría.",
        });
      }
    } catch (error) {
      if (error.response) {
        const data = error.response.data;
        let mensaje = "Error del servidor al guardar la subcategoría";
        if (typeof data === "object" && data !== null) {
          if (data.nombre && Array.isArray(data.nombre)) {
            mensaje = data.nombre[0];
          }
        } else if (data.message) {
          mensaje = data.message;
        }
        setError(mensaje);
        toast.error("Error", { description: mensaje });
      } else {
        setError("Error de conexión o configuración del cliente al guardar la subcategoría");
      }
    }
  }

  const handleDelete = async (subcategoriaId) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta subcategoria?")) return

    try {
      const response = await subcategoriaService.deleteSubcategoria(subcategoriaId);

      if(response.status === 204){
        fetchSubcategorias()
        toast.success("¡Éxito!", {
          description: "La subcategoria ha sido eliminada correctamente.",
        });
      }

    } catch (error) {
      let errorMessage = "Ocurrió un error al eliminar la subcategoria.";
      if (error.response) {
        console.error("Error Server responded:", error.response.data);
        setError(error.response.data.message || "Error del servidor al eliminar la subcategoria");
        errorMessage = error.response.data.message || "No se pudo eliminar la subcategoria.";
      } else {
        console.error("Error Request setup:", error.message);
        setError("Error de conexión o configuración al eliminar la subcategoria");
      }
    }    
    console.log("Eliminando subcategoría:", subcategoriaId)
  }

  // const stats = {
  //   total: subcategorias.length,
  //   conRecetas: subcategorias.filter((s) => s.total_recetas > 0).length,
  //   sinRecetas: subcategorias.filter((s) => s.total_recetas === 0).length,
  //   totalRecetas: subcategorias.reduce((sum, s) => sum + s.total_recetas, 0),
  // }

  const filteredSubcategorias = subcategorias.filter((subcategoria) =>
    subcategoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // const getPopularityBadge = (totalRecetas) => {
  //   if (totalRecetas >= 30) {
  //     return <Badge className="bg-green-600">Muy Popular</Badge>
  //   } else if (totalRecetas >= 15) {
  //     return <Badge className="bg-blue-600">Popular</Badge>
  //   } else if (totalRecetas >= 5) {
  //     return <Badge className="bg-yellow-600">Moderado</Badge>
  //   } else if (totalRecetas > 0) {
  //     return <Badge variant="outline">Poco Usado</Badge>
  //   } else {
  //     return <Badge variant="secondary">Sin Uso</Badge>
  //   }
  // }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Subcategorías</h1>
            <p className="text-gray-600">Administra las subcategorías para clasificar las recetas</p>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleNew}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Subcategoría
          </Button>
        </div>

        {/* Stats Cards */}
        {/* <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Subcategorías</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.conRecetas}</p>
              <p className="text-sm text-gray-600">Con Recetas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{stats.sinRecetas}</p>
              <p className="text-sm text-gray-600">Sin Recetas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.totalRecetas}</p>
              <p className="text-sm text-gray-600">Total Recetas</p>
            </CardContent>
          </Card>
        </div> */}

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Buscar Subcategorías</CardTitle>
          </CardHeader>
          <CardContent >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar subcategorías..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Subcategories Grid */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubcategorias.map((subcategoria) => (
                <Card key={subcategoria.id_subcategoria} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Tag className="h-5 w-5 text-orange-600" />
                        <CardTitle className="text-lg">{subcategoria.nombre}</CardTitle>
                      </div>
                      {/* {getPopularityBadge(subcategoria.total_recetas)} */}
                    </div>
                    <CardDescription>{subcategoria.descripcion}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Recetas asociadas:</span>
                        <Badge variant="outline" className="font-semibold">
                          +0
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(subcategoria)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => handleDelete(subcategoria.id_subcategoria)}
                        // disabled={subcategoria.total_recetas > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {filteredSubcategorias.length === 0 && !isLoading && (
          <Card className="text-center py-12">
            <CardContent>
              <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron subcategorías</h3>
              <p className="text-gray-600">Intenta cambiar el término de búsqueda</p>
            </CardContent>
          </Card>
        )}

        {/* Add/Edit Dialog */}
        <Dialog 
          open={isDialogOpen} 
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setError("");
            }
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingSubcategoria ? "Editar Subcategoría" : "Nueva Subcategoría"}</DialogTitle>
              <DialogDescription>
                {editingSubcategoria
                  ? "Modifica la información de la subcategoría"
                  : "Agrega una nueva subcategoría al sistema"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="col-span-3"
                  placeholder="Nombre de la subcategoría"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="descripcion" className="text-right">
                  Descripción
                </Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="col-span-3"
                  placeholder="Descripción de la subcategoría"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700">
                {editingSubcategoria ? "Guardar Cambios" : "Crear Subcategoría"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
