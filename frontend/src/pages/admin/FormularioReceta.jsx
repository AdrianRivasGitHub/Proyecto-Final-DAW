import { React, useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import { Checkbox } from "../../components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { toast } from "sonner"
import { ArrowLeft, Save, Upload, Plus, X, Search, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react"
import AdminLayout from '@/components/admin/AdminLayout'
import categoriaService from "@/services/categoriaService"
import regionService from "@/services/regionService"
import subcategoriaService from "@/services/subcategoriaService"
import ingredienteService from "@/services/ingredienteService"
import recetaService from "@/services/recetaService"

export default function FormularioReceta() {
  const [categorias, setCategorias] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id  //Convertir a booleano
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    preparacion: "",
    imagen_url: "",
    imagenFile: null,
    categoria_id: "",
    region_id: "",
    subcategorias: [],
    ingredientes: [],
    usuario_id:1,
  })

  const [isIngredientDialogOpen, setIsIngredientDialogOpen] = useState(false)
  const [ingredientSearch, setIngredientSearch] = useState("")
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isSubcategoryExpanded, setIsSubcategoryExpanded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const cargarDatos = async () => {
      await fetchRegiones();
      await fetchCategorias();
      await fetchSubcategorias();
      await fetchIngredientes();
      if (isEditing) {
        // Cargar datos de la receta para editar
        await loadRecipeData(id);
      }
    };
    cargarDatos();
  }, [id, isEditing])

  const unidades = ["gr", "kg", "ml", "l", "unidad", "taza", "cucharada", "cucharadita", "pizca", "al gusto"]

  const ITEMS_PER_PAGE = 8

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

  const loadRecipeData = async (recipeId) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await recetaService.getRecetaById(recipeId);
      const recetaData = response.data;
      const apiUrlBase = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
      console.log("Receta cargada:", recetaData);

      setFormData({
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

      console.log("Datos cargados:", formData);

    } catch (err) {
      console.error("Error al cargar los datos de la receta:", err);
      setError("No se pudieron cargar los datos de la receta. Inténtalo de nuevo.");
      toast.error("Error", {
        description: "No se pudieron cargar los datos de la receta.",
      });
      // navigate("/admin/recetas"); 
    } finally {
      setIsLoading(false);
    }
  }

  const filteredIngredientes = ingredientes.filter((ingrediente) =>
    ingrediente.nombre.toLowerCase().includes(ingredientSearch.toLowerCase()),
  )

  const paginadoIngredientes = filteredIngredientes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const totalPages = Math.ceil(filteredIngredientes.length / ITEMS_PER_PAGE)

  const handleSubcategoryChange = (subcategoriaId, checked) => {
    if (checked) {
      setFormData({
        ...formData,  // Mantenemos todos los datos existentes del formulario
        subcategorias: [...formData.subcategorias, subcategoriaId],
      })
    } else {
      setFormData({
        ...formData,
        subcategorias: formData.subcategorias.filter((id) => id !== subcategoriaId),  // Actualizamos el array subcategorias sin el ID seleccionado
      })
    }
  }

  const addIngredient = (ingrediente) => {
    const newIngredient = {
      ingrediente_id: ingrediente.id_ingrediente,
      nombre: ingrediente.nombre,
      cantidad: "",
      unidad: "gr",
      alergeno: ingrediente.alergeno,
    }
    setFormData({
      ...formData,
      ingredientes: [...formData.ingredientes, newIngredient],
    })
  }

  const removeIngredient = (index) => {
    const newIngredientes = formData.ingredientes.filter((_, i) => i !== index)
    setFormData({ ...formData, ingredientes: newIngredientes })
  }

  const updateIngredient = (index, field, value) => {
    const newIngredientes = [...formData.ingredientes]
    newIngredientes[index][field] = value
    setFormData({ ...formData, ingredientes: newIngredientes })
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      console.log("Subiendo imagen:", file)
      setFormData({ ...formData, imagen_url: URL.createObjectURL(file), imagenFile: file })
    }
  }

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      return "El nombre de la receta es obligatorio";
    }
    if (!formData.categoria_id) {
      return "Debe seleccionar una categoría";
    }
    if (!formData.region_id) {
      return "Debe seleccionar una región";
    }
    if (formData.ingredientes.length === 0) {
      return "Debe agregar al menos un ingrediente";
    }
    for (const ing of formData.ingredientes) {
      if (!ing.cantidad.toString().trim()) {
        return `El ingrediente "${ing.nombre}" debe tener una cantidad especificada.`;
      }
      const cantidadNum = parseFloat(ing.cantidad);
      if (isNaN(cantidadNum) || cantidadNum <= 0) {
        return `La cantidad para el ingrediente "${ing.nombre}" debe ser un número mayor que cero.`;
      }
    }
    if (!formData.preparacion.trim()) {
      return "Es obligatorio llenar la preparación.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsSaving(false);
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nombre", formData.nombre);
      formDataToSend.append("descripcion", formData.descripcion);
      formDataToSend.append("preparacion", formData.preparacion);
      formDataToSend.append("categoria_id", formData.categoria_id);
      formDataToSend.append("region_id", formData.region_id);
      formDataToSend.append("usuario_id", formData.usuario_id);
      formDataToSend.append("subcategorias", JSON.stringify(formData.subcategorias));
      formDataToSend.append("ingredientes", JSON.stringify(formData.ingredientes));

      if (formData.imagenFile) {
        formDataToSend.append("imagen", formData.imagenFile);
      } else if (!formData.imagen_url) {
        // Solo enviar eliminar_imagen si la imagen fue eliminada (no hay imagenFile ni imagen_url)
        formDataToSend.append("eliminar_imagen", true);
      }

      console.log(formDataToSend);

      let response;
      if (isEditing) {
        response = await recetaService.updateReceta(id, formDataToSend);
      } else {
        response = await recetaService.createReceta(formDataToSend);
        console.log(formDataToSend);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (response.status === 200 || response.status === 201) {
        setError("");
        console.log("Guardando receta:", formData)
        // fetchRecetas();
        toast.success(isEditing ? "Receta actualizada!" : "Receta creada!", {
          description: isEditing
            ? "La receta ha sido actualizada correctamente."
            : "La receta ha sido creada correctamente.",
        });
      } else {
        setError("Error al guardar la receta");
        toast.error("Error", {
          description: "No se pudo guardar la receta.",
        });
      }

      console.log("Guardando receta:", formDataToSend)
      navigate("/admin/recetas")
    } catch (error) {

      if(error.status === 415){
          setError("El tipo de archivo subido no es el correcto.")
      }else if (error.response) {
        const data = error.response.data;
        let mensaje = "Error del servidor al guardar la receta";
        if (typeof data === "object" && data !== null) {
          if (data.nombre && Array.isArray(data.nombre)) {
            mensaje = data.nombre[0];
          }
        } else if (data.message) {
          mensaje = data.message;
        }
        setError(mensaje);
        toast.error("Error", { description: mensaje });
        console.log(error);
        console.error("Error Server responded:", error.status);
      } else {
        setError("Error de conexión o configuración del cliente al guardar la receta");
      }
    } finally {
      setIsSaving(false)
    }
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
              <h1 className="text-3xl font-bold text-gray-900">{isEditing ? "Editar Receta" : "Nueva Receta"}</h1>
              <p className="text-gray-600">
                {isEditing ? "Modifica los datos de la receta" : "Crea una nueva receta para el sistema"}
              </p>
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={isSaving} className="bg-orange-600 hover:bg-orange-700">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Guardando..." : isEditing ? "Actualizar" : "Crear Receta"}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/*Información Básica */}
              <Card>
                <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
                  <CardDescription>Datos principales de la receta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="nombre" className="pb-2">Nombre de la Receta *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Ej: Ceviche Clásico Peruano"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="descripcion" className="pb-2">Descripción Corta</Label>
                    <Textarea
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      placeholder="Breve descripción de la receta..."
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="categoria" className="pb-2">Categoría *</Label>
                      <Select
                        value={formData.categoria_id}
                        onValueChange={(value) => setFormData({ ...formData, categoria_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categorias.map((categoria) => (
                            <SelectItem key={categoria.id_categoria} value={categoria.id_categoria.toString()}>
                              {categoria.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="region" className="pb-2">Región *</Label>
                      <Select
                        value={formData.region_id}
                        onValueChange={(value) => setFormData({ ...formData, region_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar región" />
                        </SelectTrigger>
                        <SelectContent>
                          {regiones.map((region) => (
                            <SelectItem key={region.id_region} value={region.id_region.toString()}>
                              {region.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preparacion */}
              <Card>
                <CardHeader>
                  <CardTitle>Preparación *</CardTitle>
                  <CardDescription>Instrucciones detalladas para preparar la receta</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.preparacion}
                    onChange={(e) => setFormData({ ...formData, preparacion: e.target.value })}
                    placeholder="Describe paso a paso cómo preparar la receta..."
                    rows={8}
                    className="resize-none"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Subir Imagen */}
              <Card>
                <CardHeader>
                  <CardTitle>Imagen de la Receta</CardTitle>
                  <CardDescription>Imagen principal (opcional)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formData.imagen_url && (
                      <div className="relative">
                        <img
                          src={formData.imagen_url ? formData.imagen_url : "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setFormData({ ...formData, imagen_url: "", imagenFile: null })}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {!formData.imagen_url && (
                      <div>
                        <Label htmlFor="imagen" className="cursor-pointer">
                          <div className="w-full border-2 border-dashed border-orange-300 rounded-sm p-6 text-center hover:border-red-400 transition-colors">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-600">Haz clic para subir una imagen</p>
                            <p className="text-xs text-gray-500">PNG, JPG hasta 5MB</p>
                          </div>
                        </Label>
                        <Input id="imagen" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Ingredientes */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Ingredientes *</CardTitle>
                      <CardDescription>Lista de ingredientes necesarios</CardDescription>
                    </div>
                    <Button type="button" variant="outline" onClick={() => setIsIngredientDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Ingrediente
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {formData.ingredientes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No hay ingredientes agregados</p>
                      <p className="text-sm">Haz clic en "Agregar Ingrediente" para comenzar</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.ingredientes.map((ingrediente, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium">{ingrediente.nombre}</span>
                              {getAlergenoBadge(ingrediente.alergeno)}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                value={ingrediente.cantidad}
                                onChange={(e) => updateIngredient(index, "cantidad", e.target.value)}
                                placeholder="Cantidad"
                                className="w-24"
                                min="0"
                                step="0.1"
                              />
                              <Select
                                value={ingrediente.unidad}
                                onValueChange={(value) => updateIngredient(index, "unidad", value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {unidades.map((unidad) => (
                                    <SelectItem key={unidad} value={unidad}>
                                      {unidad}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeIngredient(index)}
                            className="text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Subcategories */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Subcategorías</CardTitle>
                      <CardDescription>
                        Etiquetas opcionales ({formData.subcategorias.length} seleccionadas)
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsSubcategoryExpanded(!isSubcategoryExpanded)}
                    >
                      {isSubcategoryExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
                {isSubcategoryExpanded && (
                  <CardContent>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {subcategorias.map((subcategoria) => (
                        <div key={subcategoria.id_subcategoria} className="flex items-center space-x-2">
                          <Checkbox
                            id={`sub-${subcategoria.id_categoria}`}
                            checked={formData.subcategorias.includes(subcategoria.id_subcategoria)}
                            onCheckedChange={(checked) => handleSubcategoryChange(subcategoria.id_subcategoria, checked)}
                          />
                          <Label htmlFor={`sub-${subcategoria.id_subcategoria}`} className="text-sm">
                            {subcategoria.nombre}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
                {!isSubcategoryExpanded && formData.subcategorias.length > 0 && (
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {formData.subcategorias.map((subId) => {
                        const sub = subcategorias.find((s) => s.id === subId)
                        return (
                          <Badge key={subId} variant="secondary" className="text-xs">
                            {sub?.nombre}
                          </Badge>
                        )
                      })}
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </form>

        {/* Seleccion de ingredientes Dialog */}
        <Dialog open={isIngredientDialogOpen} onOpenChange={setIsIngredientDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Seleccionar Ingredientes</DialogTitle>
              <DialogDescription>Busca y selecciona los ingredientes para tu receta</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar ingredientes..."
                  className="pl-10"
                  value={ingredientSearch}
                  onChange={(e) => setIngredientSearch(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                {paginadoIngredientes.map((ingrediente) => {
                  const añadido = formData.ingredientes.some((ing) => ing.ingrediente_id === ingrediente.id_ingrediente)
                  return (
                    <div
                      key={ingrediente.id_ingrediente}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${añadido
                        ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                        : "hover:bg-orange-50 hover:border-orange-300"
                        }`}
                      onClick={() => !añadido && addIngredient(ingrediente)}
                    >
                      <div className="font-medium text-sm">{ingrediente.nombre}</div>
                      <div className="flex items-center space-x-1 mt-1">
                        {getAlergenoBadge(ingrediente.alergeno)}
                        {añadido && (
                          <Badge variant="outline" className="text-xs">
                            Agregado
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsIngredientDialogOpen(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
