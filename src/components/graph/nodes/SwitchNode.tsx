import React from "react";
import { GitBranch } from "lucide-react";
import clsx from "clsx";

export const SwitchNode: React.FC<{ name?: string; health?: number }> = ({
  name,
  health,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center w-full",
        "bg-yellow-50 border-2 border-yellow-300 rounded-lg shadow p-1 min-w-[90px] max-w-[120px]"
      )}
    >
      <GitBranch className="h-6 w-6 text-yellow-600 mb-0.5" />
      <span className="font-bold text-yellow-900 text-xs mb-0.5">
        {name || "Switch"}
      </span>
      {typeof health === "number" && (
        <div className="mt-1 w-full flex items-center gap-1">
          <div className="flex-1 bg-yellow-300 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-yellow-500"
              style={{ width: `${health}%` }}
            />
          </div>
          <span className="text-[10px] text-yellow-900 font-semibold ml-1">
            {health}%
          </span>
        </div>
      )}
    </div>
  );
};
