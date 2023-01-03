import { gql } from '@apollo/client';

export const GET_ALL_TODOS = gql`
  query Todos($limit: Int = 5) {
    todos(options: { paginate: { limit: $limit } }) {
      data {
        id
        title
        completed
      }
    }
  }
`;
