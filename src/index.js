import {
    GraphQLServer
} from 'graphql-yoga'

const users = [{
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

const posts = [{
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

const comments = [{
        id: 'C1',
        text: 'comment1',
        author:622108,
        post:"123"
    },
    {
        id: 'C2',
        text: 'comment2',
        author:622109,
        post:"456"
    }, {
        id: 'C3',
        text: 'comment3',
        author:622110,
        post:"789"
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
        comments(){
            return comments;
        }
    },
    'Post': {
        author(parent, args, ctx, info) {
            return users.find((user) => parent.author === user.id)
        },
        comments(parent,args,ctx,info){
            return comments.filter((comment)=>{
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
        comments(parent,args,ctx,info){
            return comments.filter((comment)=>{
                return comment.author === parent.id
            })
        }
    },
    'Comment':{
        author(parent,args,ctx,info){
            return users.find((user)=>{
                return user.id === parent.author
            })
        },
        post(parent,args,ctx,info){
            return posts.find((post)=>{
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