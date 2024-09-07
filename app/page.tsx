"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask.trim()]);
      setNewTask("");
    }
  };

  const deleteTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setNewTask(tasks[index]);
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex] = newTask.trim();
      setTasks(updatedTasks);
      setEditingIndex(null);
      setNewTask("");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">To-Do List</h1>

        <div className="flex mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-grow p-2 border rounded-l"
            placeholder="Add a new task"
          />
          <button
            onClick={editingIndex !== null ? saveEdit : addTask}
            className="bg-blue-500 text-white p-2 rounded-r"
          >
            {editingIndex !== null ? "Save" : "Add"}
          </button>
        </div>

        <ul className="space-y-2">
          {tasks.map((task, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-100 p-2 rounded"
            >
              <span>{task}</span>
              <div>
                <button
                  onClick={() => startEditing(index)}
                  className="text-blue-500 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(index)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
