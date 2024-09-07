"use server";

import { sql } from "@vercel/postgres";
import { auth, currentUser } from "@clerk/nextjs/server";
import TaskList from "./components/TaskList";
import { useCallback } from "react";

interface Task {
  id: number;
  content: string;
  created_at: string; // Add this line
}

async function getTasks(userId: string): Promise<Task[]> {
  const { rows } = await sql<Task>`
    SELECT id, content, created_at 
    FROM tasks 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
  return rows;
}

async function addTask(userId: string, content: string): Promise<Task> {
  const { rows } = await sql<Task>`
    INSERT INTO tasks (content, user_id, created_at)
    VALUES (${content}, ${userId}, NOW())
    RETURNING id, content, created_at
  `;
  return rows[0];
}

async function updateTask(
  userId: string,
  id: number,
  content: string
): Promise<Task> {
  const { rows } = await sql<Task>`
    UPDATE tasks
    SET content = ${content}
    WHERE id = ${id} AND user_id = ${userId}
    RETURNING id, content
  `;
  return rows[0];
}

async function deleteTask(userId: string, id: number) {
  await sql`DELETE FROM tasks WHERE id = ${id} AND user_id = ${userId}`;
}

async function ensureUserExists(userId: string) {
  const { rowCount } = await sql`
    INSERT INTO users (id)
    VALUES (${userId})
    ON CONFLICT (id) DO NOTHING
  `;
  return (rowCount ?? 0) > 0;
}

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Please sign in to view your tasks.</div>;
  }

  // Ensure the user exists in the database
  await ensureUserExists(userId);

  const tasks = await getTasks(userId);

  const addTaskAction = async (content: string) => {
    "use server";
    return addTask(userId, content);
  };

  const updateTaskAction = async (id: number, content: string) => {
    "use server";
    return updateTask(userId, id, content);
  };

  const deleteTaskAction = async (id: number) => {
    "use server";
    return deleteTask(userId, id);
  };

  return (
    <div className="flex">
      <TaskList
        initialTasks={tasks}
        addTask={addTaskAction}
        updateTask={updateTaskAction}
        deleteTask={deleteTaskAction}
      />
    </div>
  );
}
