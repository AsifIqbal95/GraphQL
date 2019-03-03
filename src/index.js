import {
    GraphQLServer
} from 'graphql-yoga'
import uuidv4 from 'uuid'
let users = [{
        id: 622108,
        name: 'Asif Iqbal',
        email: 'asifiqbal.a@cognizant.com',
        age: 24
    },
    {
        id: 622109,
        name: 'Ahamed Ibrahim',
        email: 'ahamedibrahim.a@cognizant.com',
        age: 14
    },
    {
        id: 622110,
        name: 'Shaliha Fathima',
        email: 'shalihafathima.a@cognizant.com',
        age: 12
    }
];

let posts = [{
        id: "123",
        title: "Asif Post",
        body: "Hello there",
        published: true,
        author: 622108
    },
    {
        id: "456",
        title: "Ibrahim Post",
        body: "Am a Gamer",
        published: true,
        author: 622109
    },
    {
        id: "789",
        title: "Shaliha Post",
        body: "Am the silent killer",
        published: true,
        author: 622110
    }
]

let comments = [{
        id: 'C1',
        text: 'comment1',
        author: 622108,
        post: "123"
    },
    {
        id: 'C2',
        text: 'comment2',
        author: 622109,
        post: "456"
    }, {
        id: 'C3',
        text: 'comment3',
        author: 622110,
        post: "789"
    }
]
const typeDefs = `
type Query{
    post(id:ID):Post
    me:User
    users(query:String):[User!]!
    posts(query:String):[Post!]!
    comments:[Comment!]!
}
type Mutation{
    createUser(data:CreateUserInput!):User!
    createPost(data:CreatePostInput!):Post!
    createComment(data:CreateComment!):Comment!
    deleteUser(id:ID!):User!
    deletePost(id:ID!):Post!
    deleteComment(id:ID!):Comment!
}

input CreateUserInput{
    name:String!
    email:String!
    age:Int
}

input CreatePostInput{
    title:String!
    body:String!
    published:Boolean!
    author:ID!
}

input CreateComment{
    text:String!
    author:ID!
    post:ID!
}

type Comment{
    id:ID!,
    text:String
    author:User!
    post :Post!
}
type Post{
    id:ID!,
    title:String!,
    body:String!
    published:Boolean!
    author:User!
    comments:[Comment!]!
}
type User{
    id:ID!,
    name:String!,
    email:String!,
    age:Int,
    posts:[Post!]!
    comments:[Comment!]!
}
`;

const resolvers = {
    'Query': {
        post(parent, args, ctx, info) {
            if (args.id == "1") {
                return {
                    id: args.id,
                    title: "First Post",
                    published: true
                }
            }
            return {
                id: "abc123",
                title: "My Post",
                body: "Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem IpsumLorem IpsumLorem",
                published: true
            }
        },
        me() {
            return {
                id: 622108,
                name: 'Asif Iqbal',
                email: 'asifiqbal.a@cognizant.com',
                age: 24
            }
        },
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users;
            }
            return users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()));
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts;
            }
            return posts.filter((post) => {
                return (post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase()))
            });
        },
        comments() {
            return comments;
        }
    },
    'Mutation': {
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex((user) => user.id == args.id);
            if (userIndex == -1) {
                throw new Error('user not found!!!!')
            }
            const deletedUser = users.splice(userIndex, 1);
            posts = posts.filter((post) => {
                const match = post.author == args.id
                if (match) {
                    comments = comments.filter((comment) => comment.post != post.id)
                }
                return !match
            })
            comments = comments.filter((comment) => comment.author != args.id)
            return deletedUser[0]
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex((post) => post.id == args.id);
            if (postIndex == -1) {
                throw new Error("Post Not Found");
            }
            const deletedPost = posts.splice(postIndex, 1);
            comments = comments.filter((comment) => {
                return comment.post != args.id
            });
            return deletedPost[0]
        },
        deleteComment(parent,args,ctx,info){
            const commentIndex = comments.findIndex((comment)=>comment.id == args.id);
            if(commentIndex == -1){
                throw new Error("Comment Not Found");
            }
            const deletedComment = comments.splice(commentIndex,1);
            return deletedComment[0] 
        },
        createComment(parent, args, ctx, info) {
            const isUserExist = users.some((user) => {
                return user.id == args.data.author
            });
            const isPostExist = posts.some((post) => post.id == args.data.post)
            if (!isUserExist || !isPostExist) {
                throw new Error("Post/User Not Found!!!!!!")
            }
            const comment = {
                id: uuidv4(),
                ...args.data
            };
            comments.push(comment)
            return comment
        },
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => user.email === args.data.email);
            if (emailTaken) {
                throw new Error('Email Already Registered');
            }
            const user = {
                id: uuidv4(),
                ...args.data
            }
            users.push(user);
            return user;
        },
        createPost(parent, args, ctx, info) {
            const isUserExist = users.some((user) => user.id == args.data.author)
            if (!isUserExist) {
                throw new Error('User Doesnt Exist!!!')
            }
            const post = {
                id: uuidv4(),
                ...args.data
            }

            posts.push(post)
            console.log(post)
            return post
        }
    },
    'Post': {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                console.log(typeof parent.author)
                console.log(typeof user.id)
                return parent.author == user.id
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.post === parent.id
            })
        }
    },
    'User': {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    },
    'Comment': {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id === parent.post
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => console.log('server is up!'));