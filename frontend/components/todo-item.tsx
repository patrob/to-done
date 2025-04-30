"use client";

import { Trash2, GripVertical, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TodoItem } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TodoItemProps {
  todo: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItemComponent({
  todo,
  onToggle,
  onDelete,
}: TodoItemProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm transition-all",
        todo.completed && "bg-slate-50 dark:bg-slate-900"
      )}
    >
      <div
        className="cursor-grab touch-manipulation flex items-center justify-center"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5 text-slate-400" />
      </div>

      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className={cn(
          "data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500",
          "transition-all"
        )}
        aria-label={`Mark "${todo.title}" as ${
          todo.completed ? "incomplete" : "complete"
        }`}
      />

      <label
        htmlFor={`todo-${todo.id}`}
        className={cn(
          "flex-1 text-slate-700 dark:text-slate-300 cursor-pointer",
          todo.completed && "line-through text-slate-400 dark:text-slate-600"
        )}
      >
        {todo.title}
      </label>

      {todo.dueDate && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "hidden sm:flex items-center text-xs px-2 py-1 rounded-full",
                  isPastDue(todo.dueDate) && !todo.completed
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                )}
              >
                <Calendar className="h-3 w-3 mr-1" />
                <span>{format(new Date(todo.dueDate), "MMM d")}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {isPastDue(todo.dueDate) && !todo.completed
                ? "Past due!"
                : `Due ${format(new Date(todo.dueDate), "MMMM d, yyyy")}`}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
        aria-label={`Delete "${todo.title}"`}
      >
        <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500 transition-colors" />
      </Button>
    </div>
  );
}

function isPastDue(date: Date): boolean {
  return new Date(date) < new Date(new Date().setHours(0, 0, 0, 0));
}

