from sqlalchemy import Column, Integer, String, JSON, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base


class Node(Base):
    __tablename__ = "nodes"

    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(String, unique=True, index=True, nullable=False)
    flow_id = Column(String, index=True, nullable=False)
    node_type = Column(String, nullable=False)
    name = Column(String, nullable=False)
    properties = Column(JSON, default={})
    position_x = Column(Integer, default=0)
    position_y = Column(Integer, default=0)
    status = Column(String, default="unknown")
    health = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())