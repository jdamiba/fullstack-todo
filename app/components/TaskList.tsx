"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

interface Task {
  id: number;
  content: string;
  created_at: string; // Add this line
}

interface TaskListProps {
  initialTasks: Task[];
  addTask: (content: string) => Promise<Task>;
  updateTask: (id: number, content: string) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;
}

export default function TaskList({
  initialTasks,
  addTask,
  updateTask,
  deleteTask,
}: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const { isLoaded, userId } = useAuth();

  if (!isLoaded || !userId) {
    return <div>Loading...</div>;
  }

  const handleAddTask = async () => {
    if (newTask.trim()) {
      const task = await addTask(newTask.trim());
      setTasks([...tasks, task]);
      setNewTask("");
    }
  };

  const handleUpdateTask = async () => {
    if (editingId !== null) {
      const updatedTask = await updateTask(editingId, newTask.trim());
      setTasks(
        tasks.map((task) => (task.id === editingId ? updatedTask : task))
      );
      setEditingId(null);
      setNewTask("");
    }
  };

  const handleDeleteTask = async (id: number) => {
    await deleteTask(id);
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setNewTask(task.content);
  };

  return (
    <div className="p-4 text-black max-w-md m-auto">
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New task"
        className="w-full p-2 border rounded text-black mb-2"
      />
      <button
        className="w-full bg-blue-500 text-white p-2 rounded mb-4"
        onClick={editingId !== null ? handleUpdateTask : handleAddTask}
      >
        {editingId !== null ? "Update" : "Add"} Task
      </button>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="bg-gray-100 p-2 rounded">
            <div className="flex justify-between items-center">
              <span>{task.content}</span>
              <span className="text-sm text-gray-500">
                {new Date(task.created_at).toLocaleString()}
              </span>
            </div>
            <div className="mt-2">
              <button
                className="bg-yellow-500 text-white p-1 rounded mr-2"
                onClick={() => startEditing(task)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white p-1 rounded"
                onClick={() => handleDeleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
