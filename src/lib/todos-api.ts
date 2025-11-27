import type { Todo } from "@/lib/todo-types";

const TODOS_BASE_PATH: string = "/api/todos";

type GetTodosResponse = {
  todos: Todo[];
};

type CreateTodoRequest = {
  title: string;
  description?: string | null;
};

type CreateTodoResponse = {
  todo: Todo;
};

type UpdateTodoRequest = {
  title?: string;
  description?: string | null;
  isCompleted?: boolean;
};

type UpdateTodoResponse = {
  todo: Todo;
};

type DeleteTodoResponse = {
  deletedId: string;
};

const handleJsonResponse = async <TResponse>(
  response: Response,
): Promise<TResponse> => {
  if (!response.ok) {
    const contentType: string | null = response.headers.get("content-type");
    if (contentType !== null && contentType.includes("application/json")) {
      const errorBody = (await response.json()) as unknown;
      throw new Error(JSON.stringify(errorBody));
    }
    throw new Error(`Request failed with status ${response.status}`);
  }
  const parsed = (await response.json()) as TResponse;
  return parsed;
};

type TodosApi = {
  getAll: () => Promise<GetTodosResponse>;
  create: (request: CreateTodoRequest) => Promise<CreateTodoResponse>;
  update: (
    id: string,
    request: UpdateTodoRequest,
  ) => Promise<UpdateTodoResponse>;
  remove: (id: string) => Promise<DeleteTodoResponse>;
};

const getAll = async (): Promise<GetTodosResponse> => {
  const response = await fetch(TODOS_BASE_PATH, {
    method: "GET",
  });
  return handleJsonResponse<GetTodosResponse>(response);
};

const create = async (
  request: CreateTodoRequest,
): Promise<CreateTodoResponse> => {
  const response = await fetch(TODOS_BASE_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  return handleJsonResponse<CreateTodoResponse>(response);
};

const update = async (
  id: string,
  request: UpdateTodoRequest,
): Promise<UpdateTodoResponse> => {
  const response = await fetch(`${TODOS_BASE_PATH}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  return handleJsonResponse<UpdateTodoResponse>(response);
};

const remove = async (id: string): Promise<DeleteTodoResponse> => {
  const response = await fetch(`${TODOS_BASE_PATH}/${id}`, {
    method: "DELETE",
  });
  return handleJsonResponse<DeleteTodoResponse>(response);
};

export const todosApi: TodosApi = {
  getAll,
  create,
  update,
  remove,
};
