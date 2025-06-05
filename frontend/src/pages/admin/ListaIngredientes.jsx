import { React, useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Plus, Edit, Trash2, Calendar, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import AdminLayout from '@/components/admin/AdminLayout'
import alergenoService from "@/services/alergenoService"
import ingredienteService from "@/services/ingredienteService"

export default function ListaIngredientes() {
  const [alergenos, setAlergenos] = useState([]);  
  const [ingredientes, setIngredientes] = useState([]);    
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAlergeno, setFilterAlergeno] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")    
  const [editingIngredient, setEditingIngredient] = useState(null)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    alergeno_id: "",
  })

  useEffect(() => {
    fetchAlergenos();
    fetchIngredientes();
  }, []);

  const fetchAlergenos = async () => {
    setIsLoading(true);
    try {
      const response = await alergenoService.getAlergenos();
      setAlergenos(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error al obtener los alergenos', error);
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
  
  const handleNew = async () => {
    setError("");
    setEditingIngredient(null)
    setFormData({
      nombre: "",
      descripcion: "",
      alergeno_id: "",
    })
    setIsDialogOpen(true)
  }  

  const handleEdit = async (ingrediente) => {
    setEditingIngredient(ingrediente)
    setFormData({
      nombre: ingrediente.nombre,
      descripcion: ingrediente.descripcion || "",
      alergeno_id: ingrediente.alergeno_id == null ? "null" : String(ingrediente.alergeno_id),
    })  
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.nombre) {
      setError("Por favor ingrese un nombre para el ingrediente")
      return
    }

    try {
      let response;
      const dataToSend = { ...formData };

      if (dataToSend.alergeno_id === "null" || dataToSend.alergeno_id === "" || dataToSend.alergeno_id == null) {
        //dataToSend.alergeno_id == null;
        formData.alergeno_id = null;
      } 

      if (editingIngredient) {
        response = await ingredienteService.updateIngrediente(editingIngredient.id_ingrediente, formData);
      } else {
      // if (dataToSend.alergeno_id === "null" || dataToSend.alergeno_id === "" || dataToSend.alergeno_id == null) {
      //   //dataToSend.alergeno_id == null;
      //   formData.alergeno_id = null;
      // }        
        response = await ingredienteService.createIngrediente(formData);
      }

      if (response.status === 200 || response.status === 201) {
        setIsDialogOpen(false);
        setEditingIngredient(null);
        setError("");
        console.log("Guardando ingrediente:", formData)
        fetchIngredientes();
        toast.success(editingIngredient ? "Ingrediente actualizado!" : "Ingrediente creado!", {
          description: editingIngredient
            ? "El Ingrediente ha sido actualizado correctamente."
            : "El Ingrediente ha sido creado correctamente.",
        });
      } else {
        setError("Error al guardar el Ingrediente");
        toast.error("Error", {
          description: "No se pudo guardar el Ingrediente.",
        });
      }
    } catch (error) {
      if (error.response) {
        const data = error.response.data;
        let mensaje = "Error del servidor al guardar el Ingrediente";
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
        setError("Error de conexión o configuración del cliente al guardar el Ingrediente");
      }
    }
  }

  const handleDelete = async (ingredienteId) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este ingrediente?")) return

    try {
      const response = await ingredienteService.deleteIngrediente(ingredienteId);

      if(response.status === 204){
        fetchIngredientes()
        toast.success("¡Éxito!", {
          description: "El ingrediente ha sido eliminada correctamente.",
        });
      }

    } catch (error) {
      let errorMessage = "Ocurrió un error al eliminar el ingrediente.";
      if (error.response) {
        console.error("Error Server responded:", error.response.data);
        setError(error.response.data.message || "Error del servidor al eliminar el ingrediente");
        errorMessage = error.response.data.message || "No se pudo eliminar el ingrediente.";
      } else {
        console.error("Error Request setup:", error.message);
        setError("Error de conexión o configuración al eliminar el ingrediente");
      }
    }        
    console.log("Eliminando ingrediente:", ingredienteId)
  }  

  // const ingredientes = [
  //   {
  //     id_ingrediente: 1,
  //     nombre: "Pescado fresco",
  //     descripcion: "Pescado del día, preferiblemente lenguado o corvina",
  //     alergeno: { nombre: "Pescado" },
  //     usado_en_recetas: true,
  //     total_recetas: 15,
  //     created_at: "2024-01-15T10:30:00Z",
  //   }
  // ]

  // const stats = {
  //   total: ingredientes.length,
  //   conAlergenos: ingredientes.filter((i) => i.alergeno).length,
  //   sinAlergenos: ingredientes.filter((i) => !i.alergeno).length,
  //   usados: ingredientes.filter((i) => i.usado_en_recetas).length,
  // }

  const filteredIngredientes = ingredientes.filter((ingrediente) => {
    const resultSearch = ingrediente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const resultAlergeno =
      filterAlergeno === "all" ||
      (filterAlergeno === "sin-alergenos" && !ingrediente.alergeno) ||
      (ingrediente.alergeno && ingrediente.alergeno.nombre === filterAlergeno)

    return resultSearch && resultAlergeno
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getAlergenoBadge = (alergeno) => {
    if (!alergeno) {
      return (
        <Badge variant="outline" className="text-green-700 border-green-300">
          Sin Alérgenos
        </Badge>
      )
    }    
    
    const allergenConfig = {
      Gluten: { className: "bg-yellow-500" }, 
      Crustáceos: { className: "bg-red-600" }, 
      Huevos: { className: "bg-amber-500" }, 
      Pescado: { className: "bg-blue-500" },
      Cacahuetes: { className: "bg-orange-800" },
      Soja: { className: "bg-green-600" },
      Lácteos: { className: "bg-gray-200 text-gray-800" },
      "Frutos de cáscara": { className: "bg-orange-500" },
      Apio: { className: "bg-lime-400 text-gray-900" },
      Mostaza: { className: "bg-yellow-700" },
      "Granos de sésamo": { className: "bg-amber-200 text-gray-900" },
      "Dióxido de azufre y sulfitos": { className: "bg-gray-400 text-gray-900" },
      Altramuces: { className: "bg-blue-200 text-gray-900" },
      Moluscos: { className: "bg-purple-600" },
    }

    const config = allergenConfig[alergeno.nombre] || { className: "bg-gray-600" }
    return (
      <Badge className={config.className}>
        <AlertTriangle className="h-3 w-3 mr-1" />
        {alergeno.nombre}
      </Badge>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Ingredientes</h1>
            <p className="text-gray-600">Administra los ingredientes disponibles para las recetas</p>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleNew}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Ingrediente
          </Button>
        </div>

        {/* Stats Cards */}
        {/* <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Ingredientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.usados}</p>
              <p className="text-sm text-gray-600">Usados en Recetas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{stats.conAlergenos}</p>
              <p className="text-sm text-gray-600">Con Alérgenos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.sinAlergenos}</p>
              <p className="text-sm text-gray-600">Sin Alérgenos</p>
            </CardContent>
          </Card>
        </div> */}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Buscar Ingredientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar ingredientes..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={filterAlergeno} onValueChange={setFilterAlergeno}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por alérgeno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los alérgenos</SelectItem>
                  <SelectItem value="sin-alergenos">Sin alérgenos</SelectItem>
                  {alergenos.map((alergeno) => (
                    <SelectItem key={alergeno.id_alergeno} value={alergeno.nombre}>
                      {alergeno.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Ingredients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Ingredientes</CardTitle>
            <CardDescription>
              Mostrando {filteredIngredientes.length} de {ingredientes.length} ingredientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {filteredIngredientes.map((ingrediente) => (
                    <div key={ingrediente.id_ingrediente} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-lg">{ingrediente.nombre}</h4>
                          {getAlergenoBadge(ingrediente.alergeno)}
                          <Badge
                            variant={ingrediente.usado_en_recetas ? "default" : "secondary"}
                            className={ingrediente.usado_en_recetas ? "bg-green-600" : ""}
                          >
                            {ingrediente.usado_en_recetas ? "En Uso" : "Sin Usar"}
                          </Badge>
                        </div>
                        {ingrediente.descripcion && <p className="text-sm text-gray-600 mb-2">{ingrediente.descripcion}</p>}
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Actualizado: {formatDate(ingrediente.updated_at)}
                          </div>
                          {ingrediente.usado_en_recetas && <span>{ingrediente.total_recetas} recetas</span>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(ingrediente)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => handleDelete(ingrediente.id_ingrediente)}
                          disabled={ingrediente.usado_en_recetas}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {filteredIngredientes.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron ingredientes que coincidan con los filtros</h3>
                <p className="text-gray-600">Intenta cambiar el filtro de búsqueda</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingIngredient ? "Editar Ingrediente" : "Nuevo Ingrediente"}</DialogTitle>
              <DialogDescription>
                {editingIngredient ? "Modifica la información del ingrediente" : "Agrega un nuevo ingrediente al sistema"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
 
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="col-span-3"
                  placeholder="Nombre del ingrediente"
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
                  placeholder="Descripción opcional del ingrediente"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="alergeno" className="text-right">
                  Alérgeno
                </Label>
                <Select
                  value={formData.alergeno_id}
                  onValueChange={(value) => setFormData({ ...formData, alergeno_id: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar alérgeno (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Sin alérgeno</SelectItem>
                    {alergenos.map((alergeno) => (
                      <SelectItem key={alergeno.id_alergeno} value={String(alergeno.id_alergeno)}>
                        {alergeno.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700">
                {editingIngredient ? "Guardar Cambios" : "Crear Ingrediente"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
