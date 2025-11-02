# Microservices Project - Clean Architecture

## Overview

Microservices system with 3 services:
- **Auth Service**: Authentication (register/login) with JWT
- **User Service**: User management
- **Post Service**: Post management with Elasticsearch search

## Architecture

```
├── auth-service/
│   ├── src/
│   │   ├── domain/          # Entities & interfaces
│   │   ├── application/     # Use cases
│   │   ├── infrastructure/  # Prisma, Kafka, GraphQL
│   │   └── presentation/    # GraphQL Resolvers
│   ├── prisma/
│   ├── Dockerfile
│   └── package.json
│
├── user-service/
│   ├── src/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── presentation/
│   ├── prisma/
│   ├── Dockerfile
│   └── package.json
│
├── post-service/
│   ├── src/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── presentation/
│   ├── prisma/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

## Quick start

```bash
# Clone and install
docker-compose up -d

# Services will be available at:
# - Auth Service: http://localhost:4001/graphql
# - User Service: http://localhost:4002/graphql
# - Post Service: http://localhost:4003/graphql
```

## API GraphQL

### Auth Service (Port 4001)

**Register**
```graphql
mutation {
  register(input: {
    email: "user@example.com"
    password: "password123"
    name: "John Doe"
  }) {
    token
    user {
      id
      email
      name
    }
  }
}
```

**Login**
```graphql
mutation {
  login(input: {
    email: "user@example.com"
    password: "password123"
  }) {
    token
    user {
      id
      email
      name
    }
  }
}
```

### User Service (Port 4002)

**Get User** (Requires JWT token in header)
```graphql
query {
  me {
    id
    email
    name
    createdAt
  }
}

# Header: Authorization: Bearer <token>
```

**Update Profile**
```graphql
mutation {
  updateProfile(input: {
    name: "Jane Doe"
  }) {
    id
    name
  }
}
```

### Post Service (Port 4003)

**Create Post**
```graphql
mutation {
  createPost(input: {
    title: "Mon premier post"
    content: "Contenu du post"
  }) {
    id
    title
    content
    authorId
  }
}
```

**Search Posts** (via Elasticsearch)
```graphql
query {
  searchPosts(query: "premier") {
    id
    title
    content
    authorId
  }
}
```

**Get My Posts**
```graphql
query {
  myPosts {
    id
    title
    content
    createdAt
  }
}
```

## Technologies

- **Node.js** + **TypeScript**
- **GraphQL** (Apollo Server)
- **Prisma** (ORM)
- **Kafka** (Event streaming)
- **Elasticsearch** (Recherche)
- **PostgreSQL** (Base de données)
- **JWT** (Authentification)
- **Docker** + **Docker Compose**

## Events Kafka

### Topics utilisés :
- `user.created` : Emitted on registration
- `user.updated` : Emitted on profile update
- `post.created` : ÉEmitted on post creation
- `post.updated` : Emitted on post update

## Clean Architecture

Each service follows Clean Architecture:

1. **Domain Layer** : Pure business entities
2. **Application Layer** : Use cases and business logic
3. **Infrastructure Layer** : Technical implementation (DB, Kafka, etc.)
4. **Presentation Layer** : API GraphQL

## Security

- Passwords hashed with bcrypt
- JWT for authentication
- Authentication middleware on protected routes
- Input validation

## Notes

- Prisma migrations are automatically run on startup
- Elasticsearch automatically indexes posts created via Kafka
- Services communicate via Kafka for decoupling
