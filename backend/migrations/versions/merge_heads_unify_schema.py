"""merge heads 3a2b1c4d5e6f and 4b7c8d9e10f1

Revision ID: 9f1e2d3c4b5a
Revises: 3a2b1c4d5e6f, 4b7c8d9e10f1
Create Date: 2025-11-19 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '9f1e2d3c4b5a'
down_revision = ('3a2b1c4d5e6f', '4b7c8d9e10f1')
branch_labels = None
depends_on = None


def upgrade():
    # No structural changes; this migration just merges divergent heads.
    pass


def downgrade():
    # Can't easily unmerge; leave as no-op.
    pass
