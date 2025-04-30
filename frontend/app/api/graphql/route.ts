import { ApolloServer } from "@apollo/server"
import { startServerAndCreateNextHandler } from "@as-integrations/next"
import { gql } from "graphql-tag"

// This is a simple in-memory store for demo purposes
// In a real app, you would use a database
let todos = [
  { id: "1", text: "Learn React", completed: true, order: 0 },
  {
    id: "2",
    text: "Build a To Do app",
    completed: false,
    order: 1,
    dueDate: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: "3",
    text: "Deploy to production",
    completed: false,
    order: 2,
    dueDate: new Date(Date.now() + 172800000).toISOString(),
  },
]

// Define GraphQL schema
const typeDefs = gql`
  scalar Date

  type Todo {
    id: ID!
    text: String!
    completed: Boolean!
    dueDate: Date
    order: Int!
  }

  type Query {
    todos: [Todo!]!
    todo(id: ID!): Todo
  }

  type Mutation {
    addTodo(text: String!, dueDate: Date): Todo!
    updateTodo(id: ID!, text: String, completed: Boolean, dueDate: Date): Todo!
    updateTodoOrder(id: ID!, order: Int!): Todo!
    deleteTodo(id: ID!): Boolean!
  }
`

// Define resolvers
const resolvers = {
  Query: {
    todos: () => todos,
    todo: (_, { id }) => todos.find((todo) => todo.id === id),
  },
  Mutation: {
    addTodo: (_, { text, dueDate }) => {
      const newTodo = {
        id: String(Date.now()),
        text,
        completed: false,
        dueDate,
        order: todos.length,
      }
      todos.push(newTodo)
      return newTodo
    },
    updateTodo: (_, { id, text, completed, dueDate }) => {
      const index = todos.findIndex((todo) => todo.id === id)
      if (index === -1) throw new Error(`Todo with ID ${id} not found`)

      const updatedTodo = {
        ...todos[index],
        ...(text !== undefined && { text }),
        ...(completed !== undefined && { completed }),
        ...(dueDate !== undefined && { dueDate }),
      }

      todos[index] = updatedTodo
      return updatedTodo
    },
    updateTodoOrder: (_, { id, order }) => {
      const index = todos.findIndex((todo) => todo.id === id)
      if (index === -1) throw new Error(`Todo with ID ${id} not found`)

      todos[index].order = order
      return todos[index]
    },
    deleteTodo: (_, { id }) => {
      const initialLength = todos.length
      todos = todos.filter((todo) => todo.id !== id)
      return todos.length !== initialLength
    },
  },
}

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

// Create and export the API route handler
const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => ({ req }),
})

export { handler as GET, handler as POST }
