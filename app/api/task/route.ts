import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { sql } from "@vercel/postgres";
import { getAuth } from "@clerk/nextjs/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content } = await request.json();
  const { rows } = await sql`
    UPDATE tasks
    SET content = ${content}
    WHERE id = ${params.id} AND user_id = ${userId}
    RETURNING id, content
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { rowCount } = await sql`
    DELETE FROM tasks
    WHERE id = ${params.id} AND user_id = ${userId}
  `;

  if (rowCount === 0) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
