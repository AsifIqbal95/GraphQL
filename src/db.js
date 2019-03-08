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

const db = {
    users,
    posts,
    comments
}

export {db as default}