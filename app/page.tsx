"use client";

import { useState } from "react";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { z } from "zod";
import {
  todoKeys,
  todoQueries,
  createTodo,
  toggleTodo,
  deleteTodo,
  type Todo,
} from "@/lib/query-keys";

const createSchema = z.object({ title: z.string().min(1).max(100) });

export default function Page() {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");

  const { data: todos, isLoading } = useQuery(todoQueries.list());

  const combined = useQueries({
    queries: [
      { ...todoQueries.list(), queryKey: todoKeys.list({ completed: false }) },
      { ...todoQueries.list(), queryKey: todoKeys.list({ completed: true }) },
    ],
    combine: (res) => ({
      activeCount: (res[0].data ?? []).length,
      completedCount: (res[1].data ?? []).length,
    }),
  });

  const create = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: todoKeys.lists() });
      setTitle("");
    },
  });

  const toggle = useMutation({
    mutationFn: toggleTodo,
    onMutate: async (variables) => {
      await qc.cancelQueries({ queryKey: todoKeys.list() });
      const previous = qc.getQueryData<Todo[]>(todoKeys.list());
      if (previous) {
        qc.setQueryData<Todo[]>(todoKeys.list(), (old) =>
          (old ?? []).map((it) =>
            it.id === variables.id
              ? { ...it, completed: variables.completed }
              : it
          )
        );
      }
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(todoKeys.list(), ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });

  const remove = useMutation({
    mutationFn: deleteTodo,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: todoKeys.list() });
      const previous = qc.getQueryData<Todo[]>(todoKeys.list());
      if (previous) {
        qc.setQueryData<Todo[]>(todoKeys.list(), (old) =>
          (old ?? []).filter((it) => it.id !== id)
        );
      }
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(todoKeys.list(), ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });

  return (
    <main>
      <h1 className="text-2xl font-semibold mb-4">Todos</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const parsed = createSchema.safeParse({ title });
          if (!parsed.success) return;
          create.mutate(parsed.data);
        }}
        className="flex gap-2 mb-6"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New todo title"
          className="flex-1 px-3 py-2 border rounded"
        />
        <button
          type="submit"
          className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
          disabled={create.isLoading}
        >
          Add
        </button>
      </form>

      {isLoading ? (
        <p>Loading…</p>
      ) : (
        <ul className="space-y-2">
          {(todos ?? []).map((it) => (
            <li
              key={it.id}
              className="flex items-center gap-2 border rounded p-2"
            >
              <input
                type="checkbox"
                checked={it.completed}
                onChange={(e) =>
                  toggle.mutate({ id: it.id, completed: e.target.checked })
                }
              />
              <span className={it.completed ? "line-through opacity-70" : ""}>
                {it.title}
              </span>
              <button
                onClick={() => remove.mutate(it.id)}
                className="ml-auto text-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
