import uuidv4 from 'uuid'

const Mutation={
    updateComment(parent,args,{db,pubsub},info){
        const {id,data} = args
        const comment = db.comments.find((comment)=>comment.id === id)
        if(!comment){
            throw new Error("Comment Not Found");
        }
        if(typeof data.text === 'string'){
            comment.text = data.text
        }
        pubsub.publish(`comment ${comment.post}`,{
            comment:{mutation:'Updated',
                data:comment}
        })
        return comment
    },
    updatePost(parent,args,{db,pubsub},info){
        const {id,data} = args
        const post = db.posts.find((post)=>post.id === id)
        const originalPost = {...post}
        if(!post){
            throw new Error("Post Not Found");
        }
        if(typeof data.title === 'string'){
            post.title = data.title
        }
        if(typeof data.body === 'string'){
            post.body = data.body
        }
        if(typeof data.published === 'boolean'){
            post.published = data.published

            if(originalPost.published && !post.published){
                pubsub.publish('post',{
                    post: {mutation:'Deleted',
                     data:post}
                 })
            }
            else if(!originalPost.published && post.published){
                pubsub.publish('post',{
                    post: {mutation:'Created',
                     data:post}
                 })
            }
        }
       else if(post.published){
            pubsub.publish('post',{
               post: {mutation:'Updated',
                data:post}
            })
        }
        return post
    },
    updateUser(parent,args,{db},info){
        const {id,data} = args
        const user = db.users.find((user)=>user.id === id)
        if(!user){
            throw new Error('user not found!!!!')
        }
        if(typeof data.email === 'string'){
                const emailTaken = db.users.some((user)=>user.email === data.email)
                if(emailTaken){
                    throw new Error('Email Taken !!')
                }
                user.email = data.email
        }

        if(typeof data.name === 'string'){
            user.name = data.name
        }

        if(typeof data.age !== 'undefined'){
            user.age = data.age
        }
        return user
    },
    deleteUser(parent, args, {db}, info) {
        const userIndex = db.users.findIndex((user) => user.id == args.id);
        if (userIndex == -1) {
            throw new Error('user not found!!!!')
        }
        const deletedUser = db.users.splice(userIndex, 1);
        db.posts = db.posts.filter((post) => {
            const match = post.author == args.id
            if (match) {
                db.comments = db.comments.filter((comment) => comment.post != post.id)
            }
            return !match
        })
        db.comments = db.comments.filter((comment) => comment.author != args.id)
        return deletedUser[0]
    },
    deletePost(parent, args, {db,pubsub}, info) {
        const postIndex = db.posts.findIndex((post) => post.id == args.id);
        if (postIndex == -1) {
            throw new Error("Post Not Found");
        }
        const [post] = db.posts.splice(postIndex, 1);
        db.comments = db.comments.filter((comment) => {
            return comment.post != args.id
        });
        if(post.published){
            pubsub.publish('post',{
               post: {mutation:'deleted',
                data:post}
            })
        }
        return post
    },
    deleteComment(parent,args,{db,pubsub},info){
        const commentIndex = db.comments.findIndex((comment)=>comment.id == args.id);
        if(commentIndex == -1){
            throw new Error("Comment Not Found");
        }
        const [comment] = db.comments.splice(commentIndex,1);
        pubsub.publish(`comment ${comment.post}`,{
            comment:{mutation:'Deleted',
                data:comment}
        })
        return comment 
    },
    createComment(parent, args, {db,pubsub}, info) {
        const isUserExist = db.users.some((user) => {
            return user.id == args.data.author
        });
        const isPostExist = db.posts.some((post) => post.id == args.data.post)
        if (!isUserExist || !isPostExist) {
            throw new Error("Post/User Not Found!!!!!!")
        }
        const comment = {
            id: uuidv4(),
            ...args.data
        };
        db.comments.push(comment)
        pubsub.publish(`comment ${args.data.post}`,{
            comment:{mutation:'Created',
                data:comment}
        })
        return comment
    },
    createUser(parent, args, {db}, info) {
        const emailTaken = db.users.some((user) => user.email === args.data.email);
        if (emailTaken) {
            throw new Error('Email Already Registered');
        }
        const user = {
            id: uuidv4(),
            ...args.data
        }
        db.users.push(user);
        return user;
    },
    createPost(parent, args, {db,pubsub}, info) {
        const isUserExist = db.users.some((user) => user.id == args.data.author)
        if (!isUserExist) {
            throw new Error('User Doesnt Exist!!!')
        }
        const post = {
            id: uuidv4(),
            ...args.data
        }

        db.posts.push(post)
        if(post.published){
            pubsub.publish('post',{
               post: {mutation:'Created',
                data:post}
            })
        }
        return post
    }
}

export{Mutation as default}