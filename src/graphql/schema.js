import { makeExecutableSchema } from 'graphql-tools';

import books from './data';

const typeDefs = `
  type Query { books: [Book] }
  type Book { title: String, author: String }
`;

const resolvers = {
  Query: {
    books() {
      return books;
    }
  }
};

export default makeExecutableSchema({
  typeDefs,
  resolvers,
});
