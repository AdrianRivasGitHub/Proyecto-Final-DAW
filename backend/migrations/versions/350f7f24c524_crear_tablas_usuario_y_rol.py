"""Crear tablas Usuario y Rol

Revision ID: 350f7f24c524
Revises: 
Create Date: 2025-04-26 05:18:46.647656

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '350f7f24c524'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('roles',
    sa.Column('id_rol', sa.Integer(), nullable=False),
    sa.Column('nombre_rol', sa.String(length=50), nullable=False),
    sa.Column('descripcion', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id_rol'),
    sa.UniqueConstraint('nombre_rol')
    )
    op.create_table('usuarios',
    sa.Column('id_usuario', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=100), nullable=False),
    sa.Column('correo', sa.String(length=120), nullable=False),
    sa.Column('contraseña', sa.String(length=255), nullable=False),
    sa.Column('rol_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['rol_id'], ['roles.id_rol'], ),
    sa.PrimaryKeyConstraint('id_usuario'),
    sa.UniqueConstraint('correo')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('usuarios')
    op.drop_table('roles')
    # ### end Alembic commands ###
