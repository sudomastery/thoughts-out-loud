"""add edited to posts

Revision ID: 4b7c8d9e10f1
Revises: 716b3ed0ff88
Create Date: 2025-11-17 23:20:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '4b7c8d9e10f1'
down_revision = '716b3ed0ff88'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('posts', sa.Column('edited', sa.Boolean(), nullable=False, server_default=sa.false()))
    # remove server_default for future inserts
    op.alter_column('posts', 'edited', server_default=None)


def downgrade():
    op.drop_column('posts', 'edited')
