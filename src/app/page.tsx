"use client";

import type { ReactElement } from "react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Todo } from "@/lib/todo-types";
import { useTodos } from "@/lib/todos-hooks";
import { useTodoFilterStore } from "@/lib/todo-filter-store";

const todoFormSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
});

type TodoFormValues = z.infer<typeof todoFormSchema>;

type TodoFilter = "all" | "active" | "completed";

type FilterButtonProps = {
  label: string;
  value: TodoFilter;
  currentFilter: TodoFilter;
  onChange: (value: TodoFilter) => void;
};

const FilterButton = ({ label, value, currentFilter, onChange }: FilterButtonProps): ReactElement => {
  const isActive: boolean = currentFilter === value;
  const baseClass: string =
    "px-3 py-1 text-sm rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900";
  const activeClass: string = "bg-zinc-900 text-white border-zinc-900";
  const inactiveClass: string = "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100";
  const className: string = `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  const handleClick = (): void => {
    onChange(value);
  };
  return (
    <button type="button" className={className} onClick={handleClick}>
      {label}
    </button>
  );
};

type TodoItemProps = {
  todo: Todo;
  onToggleCompleted: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
};

const TodoItem = ({ todo, onToggleCompleted, onDelete }: TodoItemProps): ReactElement => {
  const handleToggle = (): void => {
    onToggleCompleted(todo);
  };

  const handleDelete = (): void => {
    onDelete(todo);
  };

  const titleClassName: string = todo.is_completed
    ? "text-sm font-medium text-zinc-500 line-through"
    : "text-sm font-medium text-zinc-900";

  const descriptionClassName: string = todo.is_completed
    ? "text-xs text-zinc-400 line-through"
    : "text-xs text-zinc-600";

  return (
    <li className="flex items-start justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={handleToggle}
          className="mt-0.5 h-4 w-4 rounded border border-zinc-400 bg-white text-xs flex items-center justify-center"
        >
          {todo.is_completed ? "✓" : ""}
        </button>
        <div>
          <p className={titleClassName}>{todo.title}</p>
          {todo.description !== null && todo.description.trim().length > 0 ? (
            <p className={descriptionClassName}>{todo.description}</p>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        onClick={handleDelete}
        className="text-xs font-medium text-red-600 hover:text-red-700"
      >
        Delete
      </button>
    </li>
  );
};

const filterTodos = (todos: Todo[], filter: TodoFilter): Todo[] => {
  if (filter === "active") {
    return todos.filter((todo) => !todo.is_completed);
  }
  if (filter === "completed") {
    return todos.filter((todo) => todo.is_completed);
  }
  return todos;
};

const HomePage = (): ReactElement => {
  const { todos, isLoading, createTodo, updateTodo, deleteTodo } = useTodos();
  const { filter, setFilter } = useTodoFilterStore();

  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const filteredTodos: Todo[] = useMemo(() => filterTodos(todos, filter), [todos, filter]);

  const handleSubmit = async (values: TodoFormValues): Promise<void> => {
    await createTodo({
      title: values.title,
      description: values.description ?? null,
    });
    form.reset({ title: "", description: "" });
  };

  const handleToggleCompleted = async (todo: Todo): Promise<void> => {
    await updateTodo(todo.id, {
      isCompleted: !todo.is_completed,
    });
  };

  const handleDelete = async (todo: Todo): Promise<void> => {
    await deleteTodo(todo.id);
  };

  const handleFilterChange = (value: TodoFilter): void => {
    setFilter(value);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="w-full max-w-xl rounded-2xl bg-white px-6 py-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Todo List</h1>

        <form
          className="mb-6 flex flex-col gap-3"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="text-sm font-medium text-zinc-800">
              Title
            </label>
            <input
              id="title"
              type="text"
              {...form.register("title")}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              placeholder="Add a new task"
            />
            {form.formState.errors.title !== undefined ? (
              <p className="text-xs text-red-600">{form.formState.errors.title.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-sm font-medium text-zinc-800">
              Description (optional)
            </label>
            <textarea
              id="description"
              rows={2}
              {...form.register("description")}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              placeholder="Additional details for this task"
            />
            {form.formState.errors.description !== undefined ? (
              <p className="text-xs text-red-600">{form.formState.errors.description.message}</p>
            ) : null}
          </div>

          <button
            type="submit"
            className="mt-1 inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
            disabled={form.formState.isSubmitting}
          >
            Add task
          </button>
        </form>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-zinc-600">
            {filteredTodos.length} task{filteredTodos.length === 1 ? "" : "s"}
          </p>
          <div className="flex gap-2">
            <FilterButton
              label="All"
              value="all"
              currentFilter={filter}
              onChange={handleFilterChange}
            />
            <FilterButton
              label="Active"
              value="active"
              currentFilter={filter}
              onChange={handleFilterChange}
            />
            <FilterButton
              label="Completed"
              value="completed"
              currentFilter={filter}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-zinc-600">Loading tasks...</p>
        ) : filteredTodos.length === 0 ? (
          <p className="text-sm text-zinc-600">No tasks yet. Add your first task above.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleCompleted={handleToggleCompleted}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default HomePage;
