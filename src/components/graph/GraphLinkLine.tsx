import React from "react";

interface GraphLinkLineProps {
  source: { x: number; y: number; width: number; height: number };
  target: { x: number; y: number; width: number; height: number };
  color?: string;
  width?: number;
  markerEnd?: boolean;
  opacity?: number;
  onClick?: () => void;
  isSelected?: boolean;
}

// Функция для вычисления точки на границе прямоугольника по направлению к другой точке
function getRectEdgePoint(
  rect: { x: number; y: number; width: number; height: number },
  toward: { x: number; y: number }
) {
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  const dx = toward.x - cx;
  const dy = toward.y - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  // Нормализуем направление
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  let scale = 0.5;
  if (absDx * rect.height > absDy * rect.width) {
    // Пересекает боковую грань
    scale = rect.width / 2 / absDx;
  } else {
    // Пересекает верх/низ
    scale = rect.height / 2 / absDy;
  }
  return {
    x: cx + dx * scale,
    y: cy + dy * scale,
  };
}

export const GraphLinkLine: React.FC<GraphLinkLineProps> = ({
  source,
  target,
  color = "#22c55e",
  width = 3,
  markerEnd = true,
  opacity = 0.8,
  onClick,
  isSelected,
}) => {
  // Центры узлов
  const sourceCenter = {
    x: source.x + source.width / 2,
    y: source.y + source.height / 2,
  };
  const targetCenter = {
    x: target.x + target.width / 2,
    y: target.y + target.height / 2,
  };
  // Точки на границе
  const from = getRectEdgePoint(source, targetCenter);
  const to = getRectEdgePoint(target, sourceCenter);

  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={isSelected ? "#f59e42" : color}
      strokeWidth={width}
      markerEnd={markerEnd ? "url(#arrowhead)" : undefined}
      opacity={opacity}
      style={{ cursor: onClick ? "pointer" : undefined }}
      onClick={onClick}
    />
  );
};
