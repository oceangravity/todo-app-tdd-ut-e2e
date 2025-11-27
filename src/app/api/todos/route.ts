import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { todosRepository } from "@/lib/todos-repository";

const createTodoSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).nullable().optional(),
});

export const GET = async (): Promise<NextResponse> => {
  try {
    const result = await todosRepository.getTodos();
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch todos" },
      { status: 500 },
    );
  }
};

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const body = (await request.json()) as unknown;
    const parsed = createTodoSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid payload", issues: parsed.error.issues },
        { status: 400 },
      );
    }
    const values = {
      title: parsed.data.title,
      description: parsed.data.description ?? null,
    };
    const result = await todosRepository.createTodo({ values });
    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Failed to create todo" },
      { status: 500 },
    );
  }
};
