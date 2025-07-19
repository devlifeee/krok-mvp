from sqlalchemy.orm import Session
from app.models.flow import Flow
from app.schemas.flow import FlowCreate, FlowUpdate
from typing import List, Optional


def get_flow(db: Session, flow_id: str) -> Optional[Flow]:
    return db.query(Flow).filter(Flow.flow_id == flow_id).first()


def get_all_flows(db: Session, skip: int = 0, limit: int = 100) -> List[Flow]:
    return db.query(Flow).offset(skip).limit(limit).all()


def create_flow(db: Session, flow: FlowCreate) -> Flow:
    db_flow = Flow(
        flow_id=flow.flow_id,
        name=flow.name,
        description=flow.description
    )
    db.add(db_flow)
    db.commit()
    db.refresh(db_flow)
    return db_flow


def update_flow(db: Session, flow_id: str, flow_update: FlowUpdate) -> Optional[Flow]:
    db_flow = get_flow(db, flow_id)
    if not db_flow:
        return None

    update_data = flow_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_flow, field, value)

    db.commit()
    db.refresh(db_flow)
    return db_flow


def delete_flow(db: Session, flow_id: str) -> bool:
    db_flow = get_flow(db, flow_id)
    if not db_flow:
        return False

    db.delete(db_flow)
    db.commit()
    return True