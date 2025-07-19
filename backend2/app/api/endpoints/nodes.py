from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.crud import node as node_crud
from app.schemas.node import Node, NodeCreate, NodeUpdate

router = APIRouter()


@router.get("/", response_model=List[Node])
def get_nodes(
    flow_id: str = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Получить все узлы или узлы конкретного потока"""
    if flow_id:
        return node_crud.get_nodes_by_flow(db, flow_id=flow_id, skip=skip, limit=limit)
    return node_crud.get_all_nodes(db, skip=skip, limit=limit)


@router.get("/{node_id}", response_model=Node)
def get_node(node_id: str, db: Session = Depends(get_db)):
    """Получить узел по ID"""
    db_node = node_crud.get_node(db, node_id=node_id)
    if db_node is None:
        raise HTTPException(status_code=404, detail="Узел не найден")
    return db_node


@router.post("/", response_model=Node, status_code=status.HTTP_201_CREATED)
def create_node(node: NodeCreate, db: Session = Depends(get_db)):
    """Создать новый узел"""
    db_node = node_crud.get_node(db, node_id=node.node_id)
    if db_node:
        raise HTTPException(status_code=400, detail="Узел с таким ID уже существует")
    return node_crud.create_node(db=db, node=node)


@router.put("/{node_id}", response_model=Node)
def update_node(node_id: str, node: NodeUpdate, db: Session = Depends(get_db)):
    """Обновить узел"""
    db_node = node_crud.update_node(db, node_id=node_id, node_update=node)
    if db_node is None:
        raise HTTPException(status_code=404, detail="Узел не найден")
    return db_node


@router.delete("/{node_id}")
def delete_node(node_id: str, db: Session = Depends(get_db)):
    """Удалить узел"""
    success = node_crud.delete_node(db, node_id=node_id)
    if not success:
        raise HTTPException(status_code=404, detail="Узел не найден")
    return {"message": "Узел успешно удален"}


@router.delete("/flow/{flow_id}")
def delete_nodes_by_flow(flow_id: str, db: Session = Depends(get_db)):
    """Удалить все узлы потока"""
    count = node_crud.delete_nodes_by_flow(db, flow_id=flow_id)
    return {"message": f"Удалено {count} узлов"}