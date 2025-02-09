<script setup>
import { ref } from "vue";

const props = defineProps({
  todo: Object,
  isPaidUser: Boolean,
});

const emit = defineEmits(["update-todo", "delete-todo"]);

const isOpen = ref(false);
const isEditing = ref(false);
const editedTodo = ref({ ...props.todo });

const startEdit = () => {
  editedTodo.value = { ...props.todo };
  isEditing.value = true;
};

const saveEdit = () => {
  emit("update-todo", editedTodo.value);
  isEditing.value = false;
};

const cancelEdit = () => {
  isEditing.value = false;
};

const deleteTodo = () => {
  emit("delete-todo", props.todo.id);
};
</script>

<template>
  <div class="border rounded-lg shadow-sm bg-white mb-2">
    <div
      class="p-4 flex justify-between items-center cursor-pointer bg-gray-100 hover:bg-gray-200"
      @click="isOpen = !isOpen"
    >
      <span class="text-lg font-semibold">{{ todo.title }}</span>
      <span class="text-gray-600">{{ isOpen ? "▲" : "▼" }}</span>
    </div>

    <div v-if="isOpen" class="p-4 border-t">
      <div v-if="isEditing">
        <label class="block mb-1"><strong>Title:</strong></label>
        <input
          v-model="editedTodo.title"
          class="w-full p-2 border rounded mb-3"
        />

        <label class="block mb-1"><strong>Status:</strong></label>
        <select
          v-model="editedTodo.completed"
          class="w-full p-2 border rounded mb-3"
        >
          <option :value="true">Completed</option>
          <option :value="false">Pending</option>
        </select>

        <label class="block mb-1"><strong>Notes:</strong></label>
        <textarea
          v-if="isPaidUser"
          v-model="editedTodo.notes"
          class="w-full p-2 border rounded"
        ></textarea>

        <!-- Action Buttons -->
        <div class="mt-4 flex justify-end space-x-2">
          <button
            @click="saveEdit"
            class="px-4 py-2 bg-green-500 text-white rounded"
          >
            Save
          </button>
          <button
            @click="cancelEdit"
            class="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </div>
      <div v-else>
        <p>
          <strong>Status: </strong>
          <span :class="todo.completed ? 'text-green-600' : 'text-red-600'">
            {{ todo.completed ? "Completed" : "Pending" }}
          </span>
        </p>
        <p><strong>Creation date:</strong> {{ todo.createdAt }}</p>
        <p v-if="isPaidUser"><strong>Notes:</strong> {{ todo?.notes }}</p>

        <div class="mt-3 flex justify-end space-x-2">
          <button
            @click="startEdit"
            class="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Edit
          </button>
          <button
            @click="deleteTodo"
            class="px-4 py-2 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
