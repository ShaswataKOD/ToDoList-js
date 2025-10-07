const API_URL = "http://localhost:5000/api/tasks";

// Get all tasks
// export async function getTasks() {
//   try {
//     const res = await fetch(API_URL);
//     if (!res.ok) {
//       const error = await res.text();
//       console.error("Failed to fetch tasks:", error);
//       throw new Error("Failed to fetch tasks");
//     }
//     return res.json();
//   } catch (error) {
//     console.error("Error in getTasks:", error);
//     throw error;
//   }
// }

// export async function getTasks(tags = []) {
//   try {
//     let url = API_URL;

//     if (tags.length > 0) {
//       const tagParams = tags.map(tag => encodeURIComponent(tag)).join(",");
//       url += `?tags=${tagParams}`;
//     }

//     const res = await fetch(url);

//     if (!res.ok) {
//       const error = await res.text();
//       console.error("Failed to fetch tasks:", error);
//       throw new Error("Failed to fetch tasks");
//     }

//     return res.json();
//   } catch (error) {
//     console.error("Error in getTasks:", error);
//     throw error;
//   }
// }

export async function getTasks({ tags = [], priority = '', title = '' } = {}) {
  try {
    const params = new URLSearchParams();

    if (tags.length > 0) {
      params.append('tags', tags.join(','));
    }
    if (priority) {
      params.append('priority', priority);
    }
    if (title) {
      params.append('title', title);
    }

    const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;

    const res = await fetch(url);
    if (!res.ok) {
      const error = await res.text();
      console.error('Failed to fetch tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
    return res.json();
  } catch (error) {
    console.error('Error in getTasks:', error);
    throw error;
  }
}

//adding new task (including tags)
export async function addTask(title, priority, tags = []) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        priority,
        tags, 
        completed: false,
        timestamp: new Date().toISOString()
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Failed to add task:", error);
      throw new Error("Failed to add task");
    }

    return res.json();
  } catch (error) {
    console.error("Error in addTask:", error);
    throw error;
  }
}

// Update task 
export async function updateTask(id, data) {
  try {
    console.log("Updating task with ID:", id, "Data:", data);
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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

// Delete task
export async function deleteTask(id) {
  try {
    console.log("Deleting task with ID:", id);
    const res = await fetch(`${API_URL}/${id}`, { 
      method: "DELETE" 
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Failed to delete task:", error);
      throw new Error("Failed to delete task");
    }

    return res.json();
  } catch (error) {
    console.error("Error in deleteTask:", error);
    throw error;
  }
}


