import { queryOptions } from "@tanstack/react-query";

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export const todoKeys = {
  all: ["todos"] as const,
  lists: () => [...todoKeys.all, "list"] as const,
  list: (filters: { completed?: boolean } = {}) =>
    [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, "detail"] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
} as const;

async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch("/api/todos", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export const todoQueries = {
  list: () =>
    queryOptions({
      queryKey: todoKeys.list(),
      queryFn: fetchTodos,
      staleTime: 5_000,
    }),
};

export async function createTodo(input: { title: string }): Promise<Todo> {
  const res = await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create");
  return res.json();
}

export async function toggleTodo(input: { id: number; completed: boolean }): Promise<Todo> {
  const res = await fetch(`/api/todos/${input.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: input.completed }),
  });
  if (!res.ok) throw new Error("Failed to update");
  return res.json();
}

export async function deleteTodo(id: number): Promise<{ id: number }> {
  const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete");
  return res.json();
}


