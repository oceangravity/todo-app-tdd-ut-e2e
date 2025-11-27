import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { todosRepository } from "@/lib/todos-repository";

type RouteContext = {
  params: {
    id: string;
  };
};

const updateTodoSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(1000).nullable().optional(),
    isCompleted: z.boolean().optional(),
  })
  .refine(
    (value) =>
      typeof value.title !== "undefined" ||
      typeof value.description !== "undefined" ||
      typeof value.isCompleted !== "undefined",
    {
      message: "At least one field must be provided",
    },
  );

export const PATCH = async (
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> => {
  try {
    const body = (await request.json()) as unknown;
    const parsed = updateTodoSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid payload", issues: parsed.error.issues },
        { status: 400 },
      );
    }
    const values = {
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      isCompleted: parsed.data.isCompleted,
    };
    const result = await todosRepository.updateTodo({
      id: context.params.id,
      values,
    });
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Failed to update todo" },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  _request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> => {
  try {
    const result = await todosRepository.deleteTodo({ id: context.params.id });
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Failed to delete todo" },
      { status: 500 },
    );
  }
};
