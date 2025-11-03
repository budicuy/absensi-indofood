import { GraphQLClient } from "graphql-request";

const endpoint = "/api/graphql";

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: () => ({
    "Content-Type": "application/json",
  }),
});

export const gql = String.raw;
