import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const todos = await prisma.todo.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(todos);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.title || typeof body.title !== "string") {
    return NextResponse.json({ error: "Invalid title" }, { status: 400 });
  }
  const todo = await prisma.todo.create({ data: { title: body.title } });
  return NextResponse.json(todo, { status: 201 });
}


