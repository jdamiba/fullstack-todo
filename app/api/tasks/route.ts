import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { sql } from "@vercel/postgres";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const { userId } = await getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content } = await request.json();
  const { rows } = await sql`
    INSERT INTO tasks (content, user_id)
    VALUES (${content}, ${userId})
    RETURNING id, content
  `;
  return NextResponse.json(rows[0]);
}
