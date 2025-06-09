from app import db, create_app
from app.models.ingredientes import Ingrediente
from datetime import datetime, timezone

# Inicializar app
app = create_app()

# with app.app_context():
#     # Crear un nuevo ingrediente
#     nuevo = Ingrediente(
#         nombre="Ají amarillos",
#         descripcion="Ají típico peruano",
#         alergeno_id=None
#     )
#     db.session.add(nuevo)
#     db.session.commit()

#     print("=== CREADO ===")
#     print(f"created_at: {nuevo.created_at}")
#     print(f"updated_at: {nuevo.updated_at}")

#     # Modificar el ingrediente
#     nuevo.descripcion = "Ají típico de la costas"
#     db.session.commit()

#     print("=== ACTUALIZADO ===")
#     print(f"updated_at: {nuevo.updated_at}")
