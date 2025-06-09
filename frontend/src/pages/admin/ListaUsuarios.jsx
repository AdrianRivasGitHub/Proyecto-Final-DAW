import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
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
import { Switch } from "../../components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Edit, MoreHorizontal, UserPlus, Calendar, Mail, User, Trash2 } from "lucide-react"
import { toast } from "sonner"
import AdminLayout from "@/components/admin/AdminLayout"
import usuarioService from "@/services/usuarioService"

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [newUser, setNewUser] = useState({
    nombre: "",
    correo: "",
    rol: { nombre_rol: "Usuario" },
    activo: true,
  })

  useEffect(() => {
    fetchUsuarios();
  }, []);

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

  // const handleCreateContact = () => {
  //   console.log("Creando usuario:", newUser)
  //   setIsCreateDialogOpen(false)
  //   setNewUser({
  //     nombre: "",
  //     correo: "",
  //     rol: "Usuario",
  //     //activo: true,
  //   })
  // }  

  const handleEditUser = async () => {
    if (!selectedUser) return
    if (!selectedUser.nombre || !selectedUser.correo) {
      setError("Por favor completa todos los campos obligatorios")
      return
    }

    try{
      const usuarioUpdateData = {
        nombre: selectedUser.nombre,
        correo: selectedUser.correo,
        //rol: selectedUser.rol,
        //activo: selectedUser.activo,
      };

      const response = await usuarioService.updateUsuario(selectedUser.id_usuario, usuarioUpdateData);

      if (response.status === 200) {
        setIsEditDialogOpen(false)
        setSelectedUser(null)
        setError("")
        console.log("Guardando usuario:", selectedUser)
        fetchUsuarios();
        toast.success("¡Actualizado!", { 
          description: "El usuario ha sido actualizado correctamente.",
          // duration: 3000,
        });
      } else{
        setError("Error al actualizar el usuario");
        toast.error("Error", {
          description: "No se pudo actualizar el usuario.",
        });
      }
    } catch (error) {
      if (error.response) {
        const data = error.response.data;
        let mensaje = "Error del servidor al actualizar el usuario";
        if (typeof data === "object" && data !== null) {
          if (data.correo && Array.isArray(data.correo)) {
            mensaje = data.correo[0];
          } else if (data.nombre && Array.isArray(data.nombre)) {
            mensaje = data.nombre[0];
          }
        } else if (data.message) {
          mensaje = data.message;
        }
        setError(mensaje);
        toast.error("Error", {
          description: "No se pudo actualizar el usuario.",
        });
      } else {
        console.error("Error Client:", error.message);
        setError("Error de conexión o configuración del cliente al actualizar el usuario");
      }
      console.log(usuarioUpdateData);
    }
  }

  const openEditDialog  = (usuario) => {
    setSelectedUser(usuario)
    setIsEditDialogOpen(true)
  }  

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.rol && usuario.rol.nombre_rol === "Usuario" && (
        usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.correo.toLowerCase().includes(searchTerm.toLowerCase())
      )
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getRoleBadge = (rol) => {
    const roleConfig = {
      Administrador: { variant: "default", className: "bg-red-600" },
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
            <p className="text-gray-600">Administra las cuentas de usuario del sistema</p>
          </div>
          {/* <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Nuevo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="md:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                <DialogDescription>Añade un nuevo usuario a tu base de datos</DialogDescription>
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
                    value={newUser.nombre}
                    onChange={(e) => setSelectedUser({ ...selectedUser, nombre: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="correo" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="correo"
                    type="email"
                    value={newUser.correo}
                    onChange={(e) => setSelectedUser({ ...selectedUser, correo: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="activo" className="text-right">
                    Estado
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Switch
                      id="activo"
                      checked={newUser.activo}
                      onCheckedChange={(checked) => setSelectedUser({ ...selectedUser, activo: checked })}
                    />
                    <Label htmlFor="activo">{newUser.activo ? "Activo" : "Inactivo"}</Label>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Rol</Label>
                  <div className="col-span-3">
                    {getRoleBadge(newUser.rol.nombre_rol)}
                    <p className="text-xs text-gray-500 mt-1">El rol no se puede modificar desde aquí</p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateContact}>Crear Contacto</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Buscar Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre o email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Usuarios Tabla */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuarios</CardTitle>
            <CardDescription>
                Mostrando {filteredUsuarios.length} de {usuarios.length} usuarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    {/* <TableHead>Activo</TableHead> */}
                    <TableHead>Fecha de creación</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>                
                </TableHeader>
                <TableBody>
                  {filteredUsuarios.map((usuario) => (
                    <TableRow key={usuario.id_usuario}>
                      <TableCell>{usuario.id_usuario}</TableCell>
                      <TableCell className="font-medium">{usuario.nombre}</TableCell>
                      <TableCell>{usuario.correo || "N/A"}</TableCell>
                      {/* <TableCell>
                        <Badge
                          variant={usuario.activo ? "default" : "secondary"}
                          className={usuario.activo ? "bg-green-600" : ""}
                        >
                          {usuario.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell> */}
                      <TableCell>{formatDate(usuario.created_at)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(usuario)}>
                            <Edit className="h-4 w-4" />
                              Editar
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                              Eliminar
                          </Button>
                        </div>                      
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {filteredUsuarios.length === 0  && !isLoading && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "No se encontraron usuarios que coincidan con la búsqueda" : "No tienes usuarios registrados aún"}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        <Dialog 
          open={isEditDialogOpen} 
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              setError("");
            }
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
              <DialogDescription>
                Modifica la información del usuario. Los cambios se guardarán automáticamente.
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
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
                    value={selectedUser.nombre}
                    onChange={(e) => setSelectedUser({ ...selectedUser, nombre: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editCorreo" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="editCorreo"
                    type="email"
                    value={selectedUser.correo}
                    onChange={(e) => setSelectedUser({ ...selectedUser, correo: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                {/* <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="activo" className="text-right">
                    Estado
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Switch
                      id="activo"
                      checked={selectedUser.activo}
                      onCheckedChange={(checked) => setSelectedUser({ ...selectedUser, activo: checked })}
                    />
                    <Label htmlFor="activo">{selectedUser.activo ? "Activo" : "Inactivo"}</Label>
                  </div>
                </div> */}
                {/* <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Rol</Label>
                  <div className="col-span-3">
                    {getRoleBadge(selectedUser.rol)}
                    <p className="text-xs text-gray-500 mt-1">El rol no se puede modificar desde aquí</p>
                  </div>
                </div> */}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditUser} className="bg-orange-600 hover:bg-orange-700">
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
