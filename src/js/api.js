const API_URL = "http://localhost:5000/api/tasks";

export async function getTasks({ tags = [], priority = "", title = "" } = {}) {
  try {
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
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, priority, isCompleted, tags }),
    });

    if (!res.ok) {
      throw new Error("Failed to add task");
    }

    return res.json();
  } catch (error) {
    console.error("Error in addTask:", error);
  }
}

export async function updateTask(id, data) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
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
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
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

const { fetch: originalFetch } = window;

window.fetch = async (...args) => {
  let [resource, config = {}] = args;

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const modifiedConfig = {
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
      "Content-Type": "application/json",
    },
  };

  let response = await originalFetch(resource, modifiedConfig);

  if (response.status === 401 && refreshToken) {
    try {
      const refreshResponse = await originalFetch(
        "http://localhost:5000/api/auth/refresh",
        {
          method: "POST",
          headers: {
            refresh_token: refreshToken,
          },
        }
      );

      if (!refreshResponse.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await refreshResponse.json();
      const newAccessToken = data.accessToken;
      const newRefreshToken = data.refreshToken;

      console.log("New Access Token:", newAccessToken);
      console.log("New Refresh Token:", newRefreshToken);

      if (newAccessToken && newRefreshToken) {
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        const retryConfig = {
          ...modifiedConfig,
          headers: {
            ...modifiedConfig.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        };

        return await originalFetch(resource, retryConfig);
      } else {
        throw new Error("Missing tokens in refresh response");
      }
    } catch (err) {
      console.error("Refresh token failed", err);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "index.html";
      throw err;
    }
  }

  return response;
};
