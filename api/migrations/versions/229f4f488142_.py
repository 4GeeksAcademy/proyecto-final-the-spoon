"""empty message

Revision ID: 2cf842ff3678
Revises:
Create Date: 2025-02-24 12:37:35.516583

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "2cf842ff3678"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_name", sa.String(length=50), nullable=False),
        sa.Column("password", sa.String(length=50), nullable=False),
        sa.Column("email", sa.String(length=50), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("users")
    # ### end Alembic commands ###