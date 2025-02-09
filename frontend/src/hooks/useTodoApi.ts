import { ref } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type userRole = "free" | "paid";

export interface Todo {
  id?: number;
  title: string;
  completed: boolean;
  notes?: string;
  userRole?: userRole; // Ensure TypeScript allows this
}

export function useTodo() {
  const route = useRoute();
  const todos = ref<Todo[]>([]);
  const isLoading = ref(false);
  const showModal = ref(false);
  const modalMessage = ref("");

  const fetchTodos = async () => {
    isLoading.value = true;
    try {
      const response = await axios.get(
        `${API_BASE_URL}/super-todo/?userRole=${route.query.userRole}`
      );
      todos.value = response.data.data;
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setTimeout(() => (isLoading.value = false), 1000);
    }
  };

  const saveTodo = async (newTodo: Todo) => {
    isLoading.value = true;
    try {
      const payload: Todo = {
        title: newTodo.title,
        completed: newTodo.completed,
        userRole: route.query.userRole as userRole,
        ...(newTodo.notes ? { notes: newTodo.notes } : {}),
      };

      const response = await axios.post(`${API_BASE_URL}/super-todo`, payload);

      setTimeout(async () => {
        if (response.data.code === 1) {
          modalMessage.value = "To-Do has been successfully created!";
          showModal.value = true;
          await fetchTodos();
        } else {
          modalMessage.value = "Failed to create To-Do!";
          showModal.value = true;
        }
        isLoading.value = false;
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        modalMessage.value = "An error occurred while creating To-Do!";
        showModal.value = true;
        isLoading.value = false;
      }, 1000);
    }
  };

  const updateTodo = async (todo: Todo) => {
    isLoading.value = true;
    try {
      const payload: Partial<Todo> = {
        title: todo.title,
        completed: todo.completed,
        ...(todo.notes ? { notes: todo.notes } : {}),
      };

      const response = await axios.put(
        `${API_BASE_URL}/super-todo/${todo.id}`,
        payload
      );

      setTimeout(async () => {
        if (response.data.code === 1) {
          modalMessage.value = "To-Do has been successfully updated!";
          showModal.value = true;
          await fetchTodos();
        } else {
          modalMessage.value = "Failed to update To-Do!";
          showModal.value = true;
        }
        isLoading.value = false;
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        modalMessage.value = "An error occurred while updating To-Do!";
        showModal.value = true;
        isLoading.value = false;
      }, 1000);
    }
  };

  const deleteTodo = async (id: number) => {
    isLoading.value = true;
    try {
      const response = await axios.delete(`${API_BASE_URL}/super-todo/${id}`);

      setTimeout(async () => {
        if (response.data.code === 1) {
          modalMessage.value = "To-Do has been successfully deleted!";
          showModal.value = true;
          await fetchTodos();
        } else {
          modalMessage.value = "Failed to delete To-Do!";
          showModal.value = true;
        }
        isLoading.value = false;
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        modalMessage.value = "An error occurred while deleting To-Do!";
        showModal.value = true;
        isLoading.value = false;
      }, 1000);
    }
  };

  return {
    todos,
    isLoading,
    showModal,
    modalMessage,
    fetchTodos,
    saveTodo,
    updateTodo,
    deleteTodo,
  };
}
