from sqlalchemy.orm import Session
from app.models.node import Node
from app.schemas.node import NodeCreate, NodeUpdate
from typing import List, Optional


def get_node(db: Session, node_id: str) -> Optional[Node]:
    return db.query(Node).filter(Node.node_id == node_id).first()


def get_nodes_by_flow(db: Session, flow_id: str, skip: int = 0, limit: int = 100) -> List[Node]:
    return db.query(Node).filter(Node.flow_id == flow_id).offset(skip).limit(limit).all()


def get_all_nodes(db: Session, skip: int = 0, limit: int = 100) -> List[Node]:
    return db.query(Node).offset(skip).limit(limit).all()


def create_node(db: Session, node: NodeCreate) -> Node:
    db_node = Node(
        node_id=node.node_id,
        flow_id=node.flow_id,
        node_type=node.node_type,
        name=node.name,
        properties=node.properties,
        position_x=node.position_x,
        position_y=node.position_y,
        status=node.status,
        health=node.health
    )
    db.add(db_node)
    db.commit()
    db.refresh(db_node)
    return db_node


def update_node(db: Session, node_id: str, node_update: NodeUpdate) -> Optional[Node]:
    db_node = get_node(db, node_id)
    if not db_node:
        return None

    update_data = node_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_node, field, value)

    db.commit()
    db.refresh(db_node)
    return db_node


def delete_node(db: Session, node_id: str) -> bool:
    db_node = get_node(db, node_id)
    if not db_node:
        return False

    db.delete(db_node)
    db.commit()
    return True


def delete_nodes_by_flow(db: Session, flow_id: str) -> int:
    result = db.query(Node).filter(Node.flow_id == flow_id).delete()
    db.commit()
    return result