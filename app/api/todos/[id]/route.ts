import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const body = await req.json().catch(() => null);
  if (typeof body?.completed !== "boolean") {
    return NextResponse.json({ error: "Invalid completed" }, { status: 400 });
  }
  const todo = await prisma.todo.update({ where: { id }, data: { completed: body.completed } });
  return NextResponse.json(todo);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await prisma.todo.delete({ where: { id } });
  return NextResponse.json({ id });
}


