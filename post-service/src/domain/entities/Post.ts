export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostInput {
  title: string;
  content: string;
  authorId: string;
}

export interface UpdatePostInput {
    title?: string;
    content?: string;
    published?: boolean;
}

/* export interface PostIndexMapping {
  properties: {
    id: { type: "keyword" };
    title: { type: "text" };
    content: { type: "text" };
    authorId: { type: "keyword" };
    createdAt: { type: "date" };
  };
} */