export const typeDefs = `#graphql
    type User {
        id: ID!
        email: String!
        name: String!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    input RegisterUserInput {
        email: String!
        password: String!
        name: String!
    }

    input LoginInput {
        email: String!
        password: String!
    }

    type Query {
        _empty: String
    }

    type Mutation {
        register(input: RegisterUserInput!): AuthPayload!
        login(input: LoginInput!): AuthPayload!
    }
`;
