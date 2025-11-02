export const typeDefs = `#graphql
    type Post {
        id: ID!
        title: String!
        content: String!
        authorId: String!
        published: Boolean!
        createdAt: String!
        updatedAt: String!
    }

    input CreatePostInput {
        title: String!
        content: String!
    }
    
    type Query {
        myPosts: [Post!]!
        searchPosts(query: String!): [Post!]!
    }

    type Mutation {
        createPost(input: CreatePostInput!): Post!
    }
`;
