import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Todo } from "@/lib/todo-types";
import { todosApi } from "@/lib/todos-api";

const TODOS_QUERY_KEY = ["todos"] as const;

type UseTodosResult = {
  todos: Todo[];
  isLoading: boolean;
  createTodo: (values: { title: string; description?: string | null }) => Promise<void>;
  updateTodo: (id: string, values: { title?: string; description?: string | null; isCompleted?: boolean }) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
};

export const useTodos = (): UseTodosResult => {
  const queryClient = useQueryClient();

  const todosQuery = useQuery<{ todos: Todo[] }, Error, Todo[]>({
    queryKey: TODOS_QUERY_KEY,
    queryFn: async () => {
      const response = await todosApi.getAll();
      return response.todos;
    },
    select: (data) => data.todos,
  });

  const createMutation = useMutation({
    mutationFn: todosApi.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (variables: { id: string; values: { title?: string; description?: string | null; isCompleted?: boolean } }) =>
      todosApi.update(variables.id, variables.values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (variables: { id: string }) => todosApi.remove(variables.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });

  const createTodo = async (values: { title: string; description?: string | null }): Promise<void> => {
    await createMutation.mutateAsync(values);
  };

  const updateTodo = async (
    id: string,
    values: { title?: string; description?: string | null; isCompleted?: boolean },
  ): Promise<void> => {
    await updateMutation.mutateAsync({ id, values });
  };

  const deleteTodo = async (id: string): Promise<void> => {
    await deleteMutation.mutateAsync({ id });
  };

  return {
    todos: todosQuery.data ?? [],
    isLoading: todosQuery.isLoading,
    createTodo,
    updateTodo,
    deleteTodo,
  };
};
