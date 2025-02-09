<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTodo } from "../hooks/useTodoApi";
import type { Todo } from "../hooks/useTodoApi";
import TodoItem from "../components/TodoItem.vue";

const route = useRoute();
const router = useRouter();
const isPaidUser = ref(false);
const showForm = ref(false);
const newTodo = ref<Todo>({ title: "", completed: false, notes: "" });

const {
  todos,
  isLoading,
  showModal,
  modalMessage,
  fetchTodos,
  saveTodo,
  updateTodo,
  deleteTodo,
} = useTodo();

onMounted(async () => {
  const role = route.query.userRole || "free";
  isPaidUser.value = role === "paid";
  router.replace({ query: { userRole: role } });
  await fetchTodos();
});

const handleSaveTodo = async () => {
  showForm.value = false;
  await saveTodo(newTodo.value);
  newTodo.value = { title: "", completed: false, notes: "" };
};
</script>

<template>
  <div class="w-full min-h-screen bg-gray-100 flex flex-col relative">
    <!-- Full-page loading spinner -->
    <div
      v-if="isLoading"
      class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
    >
      <div
        class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"
      ></div>
    </div>

    <main class="flex justify-center p-6">
      <div class="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4 text-center">To-Do List</h2>
        <p class="text-center text-gray-600 mb-4">
          You are using the
          <strong>{{ isPaidUser ? "Paid" : "Free" }}</strong> plan.
        </p>

        <div>
          <TodoItem
            v-for="todo in todos"
            :key="todo.id"
            :todo="todo"
            :isPaidUser="isPaidUser"
            @update-todo="updateTodo"
            @delete-todo="deleteTodo"
          />
        </div>

        <div v-if="!showForm" class="mt-6 text-center">
          <button
            @click="showForm = true"
            class="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add New To-Do
          </button>
        </div>

        <div v-if="showForm" class="mt-4 p-4 bg-gray-100 rounded-lg">
          <input
            v-model="newTodo.title"
            class="w-full p-2 border rounded mb-3"
            placeholder="Enter title..."
          />
          <select
            v-model="newTodo.completed"
            class="w-full p-2 border rounded mb-3"
          >
            <option :value="false">Pending</option>
            <option :value="true">Completed</option>
          </select>
          <textarea
            v-if="isPaidUser"
            v-model="newTodo.notes"
            class="w-full p-2 border rounded mb-3"
            placeholder="Add notes..."
          ></textarea>
          <div class="flex justify-end gap-2">
            <button
              @click="handleSaveTodo"
              class="px-4 py-2 bg-green-600 text-white rounded"
            >
              Save
            </button>
            <button
              @click="showForm = false"
              class="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>

  <div
    v-if="showModal"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg text-center">
      <p class="text-lg font-semibold">{{ modalMessage }}</p>
      <button
        @click="showModal = false"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        OK
      </button>
    </div>
  </div>
</template>
