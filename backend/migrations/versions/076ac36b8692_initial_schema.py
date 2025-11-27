"""initial schema

Revision ID: 076ac36b8692
Revises: 
Create Date: 2025-11-26 20:31:55.440308

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '076ac36b8692'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create users table
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(length=80), nullable=False),
        sa.Column('email', sa.String(length=120), nullable=False),
        sa.Column('password', sa.String(length=255), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('username')
    )
    
    # Create posts table
    op.create_table('posts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('edited', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create hashtags table
    op.create_table('hashtags',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )
    
    # Create comments table
    op.create_table('comments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('post_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['post_id'], ['posts.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create followers association table
    op.create_table('followers',
        sa.Column('follower_id', sa.Integer(), nullable=False),
        sa.Column('followed_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['followed_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['follower_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('follower_id', 'followed_id')
    )
    
    # Create likes association table
    op.create_table('likes',
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('post_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['post_id'], ['posts.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('user_id', 'post_id')
    )
    
    # Create post_hashtags association table
    op.create_table('post_hashtags',
        sa.Column('post_id', sa.Integer(), nullable=False),
        sa.Column('hashtag_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['hashtag_id'], ['hashtags.id'], ),
        sa.ForeignKeyConstraint(['post_id'], ['posts.id'], ),
        sa.PrimaryKeyConstraint('post_id', 'hashtag_id')
    )


def downgrade():
    # Drop tables in reverse order (respecting foreign key constraints)
    op.drop_table('post_hashtags')
    op.drop_table('likes')
    op.drop_table('followers')
    op.drop_table('comments')
    op.drop_table('hashtags')
    op.drop_table('posts')
    op.drop_table('users')
