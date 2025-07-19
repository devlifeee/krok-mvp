from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class NodeBase(BaseModel):
    node_id: str
    flow_id: str
    node_type: str
    name: str
    properties: Dict[str, Any] = {}
    position_x: int = 0
    position_y: int = 0
    status: str = "unknown"
    health: int = 0


class NodeCreate(NodeBase):
    pass


class NodeUpdate(BaseModel):
    name: Optional[str] = None
    properties: Optional[Dict[str, Any]] = None
    position_x: Optional[int] = None
    position_y: Optional[int] = None
    status: Optional[str] = None
    health: Optional[int] = None


class Node(NodeBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True