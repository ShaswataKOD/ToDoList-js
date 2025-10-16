// KILLLLLLL

const API_URL = "http://localhost:5000/api/tasks";

export async function getTasks({ tags = [], priority = "", title = "" } = {}) {
  try {
    const token = localStorage.getItem("accessToken");
    const params = new URLSearchParams();

    if (tags.length > 0) {
      params.append("tags", tags.join(","));
    }

    if (priority) {
      params.append("priority", priority);
    }

    if (title) {
      params.append("title", title);
    }

    const url = params.toString()
      ? `${API_URL}/search?${params.toString()}`
      : API_URL;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.text();

      console.error("Failed to fetch tasks:", error);

      throw new Error("Failed to fetch tasks");
    }

    return res.json();
  } catch (error) {
    console.error("Error in getTasks:", error);
    return [];
  }
}

export async function addTask(title, priority, isCompleted, tags = []) {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        priority,
        isCompleted,
        tags,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to add Tasks");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error in Add task", error);
  }
}

export async function updateTask(id, data) {
  try {
    const token = localStorage.getItem("accessToken");

    console.log("Updating task with ID:", id, "Data:", data);

    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Failed to update task:", error);
      throw new Error("Failed to update task");
    }

    return res.json();
  } catch (error) {
    console.error("Error in updateTask:", error);
    throw error;
  }
}

export async function deleteTask(id) {
  try {
    const token = localStorage.getItem("accessToken");

    console.log("Deleting task with ID:", id);

    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.text();

      console.error("Failed to delete task:", error);
      
      throw new Error("Failed to delete task");
    }
    return res.json();
  } catch (error) {
    console.error("Error in deleteTask:", error);
  }
}
