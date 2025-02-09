import axios from "axios";
import { useRoute } from "vue-router";
import { useTodo } from "./useTodoApi";
import flushPromises from "flush-promises";

jest.mock("axios");
jest.mock("vue-router", () => ({
  useRoute: jest.fn(),
}));

describe("useTodo", () => {
  const mockRoute = {
    query: {
      userRole: "free",
    },
  };

  beforeEach(() => {
    (useRoute as jest.Mock).mockReturnValue(mockRoute);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetchTodos should fetch todos and update todos ref", async () => {
    const mockTodos = [{ id: 1, title: "Test Todo", completed: false }];
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: mockTodos } });

    const { fetchTodos, todos, isLoading } = useTodo();
    fetchTodos();
    expect(isLoading.value).toBe(true);

    await flushPromises();

    expect(todos.value).toEqual(mockTodos);
    expect(isLoading.value).toBe(false);
  });

  it("saveTodo should save a new todo and update todos ref", async () => {
    const newTodo = { title: "New Todo", completed: false };
    const mockResponse = { data: { code: 1 } };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: [newTodo] } });

    const { saveTodo, todos, isLoading, showModal, modalMessage } = useTodo();
    saveTodo(newTodo);
    expect(isLoading.value).toBe(true);

    await flushPromises();

    expect(showModal.value).toBe(true);
    expect(modalMessage.value).toBe("To-Do has been successfully created!");
    expect(todos.value).toEqual([newTodo]);
    expect(isLoading.value).toBe(false);
  });

  it("updateTodo should update an existing todo and update todos ref", async () => {
    const updatedTodo = { id: 1, title: "Updated Todo", completed: true };
    const mockResponse = { data: { code: 1 } };
    (axios.put as jest.Mock).mockResolvedValue(mockResponse);
    (axios.get as jest.Mock).mockResolvedValue({
      data: { data: [updatedTodo] },
    });

    const { updateTodo, todos, isLoading, showModal, modalMessage } = useTodo();
    updateTodo(updatedTodo);
    expect(isLoading.value).toBe(true);

    await flushPromises();

    expect(showModal.value).toBe(true);
    expect(modalMessage.value).toBe("To-Do has been successfully updated!");
    expect(todos.value).toEqual([updatedTodo]);
    expect(isLoading.value).toBe(false);
  });

  it("deleteTodo should delete a todo and update todos ref", async () => {
    const mockResponse = { data: { code: 1 } };
    (axios.delete as jest.Mock).mockResolvedValue(mockResponse);
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: [] } });

    const { deleteTodo, todos, isLoading, showModal, modalMessage } = useTodo();
    deleteTodo(1);
    expect(isLoading.value).toBe(true);

    await flushPromises();

    expect(showModal.value).toBe(true);
    expect(modalMessage.value).toBe("To-Do has been successfully deleted!");
    expect(todos.value).toEqual([]);
    expect(isLoading.value).toBe(false);
  });
});
