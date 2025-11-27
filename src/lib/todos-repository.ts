import type { TablesInsert, TablesUpdate } from "@/lib/database-types";
import type { Todo } from "@/lib/todo-types";
import { supabaseClient } from "@/lib/supabase-client";

type TodoInsert = TablesInsert<"todos">;
type TodoUpdate = TablesUpdate<"todos">;

type GetTodosResult = { todos: Todo[] };

type CreateTodoValues = { title: string; description?: string | null };
type CreateTodoParams = { values: CreateTodoValues };
type CreateTodoResult = { todo: Todo };

type UpdateTodoValues = { title?: string; description?: string | null; isCompleted?: boolean };
type UpdateTodoParams = { id: string; values: UpdateTodoValues };
type UpdateTodoResult = { todo: Todo };

type DeleteTodoParams = { id: string };
type DeleteTodoResult = { deletedId: string };

type TodosRepository = {
  getTodos: () => Promise<GetTodosResult>;
  createTodo: (params: CreateTodoParams) => Promise<CreateTodoResult>;
  updateTodo: (params: UpdateTodoParams) => Promise<UpdateTodoResult>;
  deleteTodo: (params: DeleteTodoParams) => Promise<DeleteTodoResult>;
};

const getTodos = async (): Promise<GetTodosResult> => {
  const query = supabaseClient.from("todos").select("*").order("created_at", { ascending: false });
  const { data, error } = await query;
  if (error !== null) {
    throw new Error(error.message);
  }
  const safeTodos: Todo[] = data ?? [];
  return { todos: safeTodos };
};

const createTodo = async (params: CreateTodoParams): Promise<CreateTodoResult> => {
  const insertPayload: TodoInsert = {
    title: params.values.title,
    description: params.values.description ?? null,
  };
  const query = supabaseClient.from("todos").insert(insertPayload).select("*").single();
  const { data, error } = await query;
  if (error !== null) {
    throw new Error(error.message);
  }
  if (data === null) {
    throw new Error("Todo insert returned null data");
  }
  return { todo: data };
};

const updateTodo = async (params: UpdateTodoParams): Promise<UpdateTodoResult> => {
  const updatePayload: TodoUpdate = { };
  if (typeof params.values.title === "string") {
    updatePayload.title = params.values.title;
  }
  if (typeof params.values.description !== "undefined") {
    updatePayload.description = params.values.description ?? null;
  }
  if (typeof params.values.isCompleted === "boolean") {
    updatePayload.is_completed = params.values.isCompleted;
  }
  const query = supabaseClient.from("todos").update(updatePayload).eq("id", params.id).select("*").single();
  const { data, error } = await query;
  if (error !== null) {
    throw new Error(error.message);
  }
  if (data === null) {
    throw new Error("Todo update returned null data");
  }
  return { todo: data };
};

const deleteTodo = async (params: DeleteTodoParams): Promise<DeleteTodoResult> => {
  const query = supabaseClient.from("todos").delete().eq("id", params.id);
  const { error } = await query;
  if (error !== null) {
    throw new Error(error.message);
  }
  return { deletedId: params.id };
};

export const todosRepository: TodosRepository = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
