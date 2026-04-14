"use server";

import { revalidatePath } from "next/cache";
import { serverClient } from "@/sanity/lib/serverClient";
import { requireUser } from "@/lib/requireUser";

type TodoMutationResult = {
  success: boolean;
  error: string | null;
  redirectTo?: string;
};

type OwnedTodo = {
  _id: string;
  carId?: string;
  dueDate?: string;
  recurrence?: string;
};

async function getOwnedTodo(id: string, userId: string): Promise<OwnedTodo | null> {
  return serverClient.fetch(
    `*[_type == "todo" && _id == $id && user._ref == $userId][0]{
      _id,
      dueDate,
      recurrence,
      "carId": car->_id
    }`,
    { id, userId }
  );
}

function revalidateTodoPaths(todoId: string, carId?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/todo");
  revalidatePath(`/todo/${todoId}`);

  if (carId) {
    revalidatePath(`/vehicle/${carId}`);
    revalidatePath(`/vehicle/${carId}/todo`);
  }
}

function getNextDueDate(dateValue: string, recurrence: string) {
  const nextDate = new Date(dateValue);

  if (Number.isNaN(nextDate.getTime())) {
    return dateValue;
  }

  switch (recurrence) {
    case "daily":
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case "weekly":
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case "yearly":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      return dateValue;
  }

  return nextDate.toISOString();
}

export async function updateTodo(
  id: string,
  formData: FormData
): Promise<TodoMutationResult> {
  try {
    const { userId } = await requireUser();
    const todo = await getOwnedTodo(id, userId);

    if (!todo?._id) {
      return { success: false, error: "To-do not found." };
    }

    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const dueDate = String(formData.get("dueDate") || "").trim();
    const priority = String(formData.get("priority") || "medium").trim() || "medium";
    const status = String(formData.get("status") || "open").trim() || "open";
    const recurrence = String(formData.get("recurrence") || "none").trim() || "none";
    const reminderEnabled = formData.get("reminderEnabled") === "on";
    const reminderOffset = String(formData.get("reminderOffset") || "1week").trim() || "1week";

    if (!title) {
      return { success: false, error: "Title is required." };
    }

    if (!dueDate) {
      return { success: false, error: "Due date is required." };
    }

    let patch = serverClient.patch(id).set({
      title,
      description: description || undefined,
      dueDate,
      priority,
      status,
      recurrence,
      reminderEnabled,
      reminderOffset: reminderEnabled ? reminderOffset : undefined,
    });

    patch = patch.unset(["reminderLastSentAt"]);

    if (!reminderEnabled) {
      patch = patch.unset(["reminderOffset"]);
    }

    await patch.commit();

    revalidateTodoPaths(id, todo.carId);

    return { success: true, error: null, redirectTo: `/todo/${id}` };
  } catch (err) {
    console.error("UPDATE TODO ERROR:", err);
    return { success: false, error: "Failed to update to-do." };
  }
}

export async function completeTodo(id: string): Promise<TodoMutationResult> {
  try {
    const { userId } = await requireUser();
    const todo = await getOwnedTodo(id, userId);

    if (!todo?._id) {
      return { success: false, error: "To-do not found." };
    }

    if (todo.recurrence && todo.recurrence !== "none" && todo.dueDate) {
      const nextDueDate = getNextDueDate(todo.dueDate, todo.recurrence);

      await serverClient
        .patch(id)
        .set({
          dueDate: nextDueDate,
          status: "open",
        })
        .unset(["reminderLastSentAt"])
        .commit();
    } else {
      await serverClient.patch(id).set({ status: "done" }).commit();
    }

    revalidateTodoPaths(id, todo.carId);

    return { success: true, error: null, redirectTo: `/todo/${id}` };
  } catch (err) {
    console.error("COMPLETE TODO ERROR:", err);
    return { success: false, error: "Failed to complete to-do." };
  }
}

export async function deleteTodo(id: string): Promise<TodoMutationResult> {
  try {
    const { userId } = await requireUser();
    const todo = await getOwnedTodo(id, userId);

    if (!todo?._id) {
      return { success: false, error: "To-do not found." };
    }

    await serverClient.delete(id);

    revalidateTodoPaths(id, todo.carId);

    return {
      success: true,
      error: null,
      redirectTo: todo.carId ? `/vehicle/${todo.carId}/todo` : "/todo",
    };
  } catch (err) {
    console.error("DELETE TODO ERROR:", err);
    return { success: false, error: "Failed to delete to-do." };
  }
}
