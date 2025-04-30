import { Todo } from "../models/todo";

export const resolvers = {
  Query: {
    todos: async () => {
      return await Todo.find().sort({ createdAt: -1 });
    },
    todo: async (_: any, { id }: { id: string }) => {
      return await Todo.findById(id);
    },
  },
  Mutation: {
    createTodo: async (_: any, { title }: { title: string }) => {
      const todo = new Todo({ title });
      await todo.save();
      return todo;
    },
    updateTodo: async (
      _: any,
      {
        id,
        title,
        completed,
      }: { id: string; title?: string; completed?: boolean }
    ) => {
      const todo = await Todo.findByIdAndUpdate(
        id,
        {
          ...(title && { title }),
          ...(completed !== undefined && { completed }),
        },
        { new: true }
      );
      if (!todo) throw new Error("Todo not found");
      return todo;
    },
    deleteTodo: async (_: any, { id }: { id: string }) => {
      const result = await Todo.findByIdAndDelete(id);
      return !!result;
    },
  },
};
