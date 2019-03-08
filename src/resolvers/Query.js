 const Query = {
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
    users(parent, args, {db}, info) {
        if (!args.query) {
            return db.users;
        }
        return db.users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()));
    },
    posts(parent, args, {db}, info) {
        if (!args.query) {
            return db.posts;
        }
        return db.posts.filter((post) => {
            return (post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase()))
        });
    },
    comments(parent,args,{db},info) {
        return db.comments;
    }
}

export {Query as default}