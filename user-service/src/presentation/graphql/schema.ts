export const typeDefs = `#graphql
    type User {
        id: ID!
        email: String!
        name: String!
        createdAt: String!
        updatedAt: String!
    }

    input UpdateProfileInput {
        name: String!
    }

    type Query {
        me: User!
    }

    type Mutation {
        updateProfile(input: UpdateProfileInput!): User!
    }
`;
