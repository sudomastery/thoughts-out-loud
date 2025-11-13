"""add email and password fields to user

Revision ID: bfaf18b5e876
Revises: 2c0369ebfbc2
Create Date: 2025-11-13 16:13:23.498423

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bfaf18b5e876'
down_revision = '2c0369ebfbc2'
branch_labels = None
depends_on = None


def upgrade():
    # Step 1: Add columns as NULLABLE first
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('email', sa.String(length=120), nullable=True))
        batch_op.add_column(sa.Column('password', sa.String(length=255), nullable=True))

    # Step 2: Give existing rows TEMPORARY values
    op.execute("UPDATE users SET email = 'temp@example.com' WHERE email IS NULL;")
    op.execute("UPDATE users SET password = 'temporary' WHERE password IS NULL;")

    # Step 3: Now enforce NOT NULL + unique constraint
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('email', nullable=False)
        batch_op.alter_column('password', nullable=False)
        batch_op.create_unique_constraint("uq_users_email", ['email'])


def downgrade():
    # Drop fields on downgrade
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_constraint("uq_users_email", type_='unique')
        batch_op.drop_column('password')
        batch_op.drop_column('email')
