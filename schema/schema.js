const graphql = require('graphql')
const _ = require('lodash')
const User = require('../models/user')
const Hobby = require('../models/hobby')
const Post = require('../models/post')
// var usersData = [
//     {id : '1', name : 'Bond', age : 36, profession: "Programmer"},
//     {id : '2', name : 'Anna', age : 26, profession: "Baker"},
//     {id : '3', name : 'Bella', age : 16, profession: "Mechanic"},
//     {id : '4', name : 'Gina', age : 26, profession: "Painter"},
//     {id : '5', name : 'Georgina', age : 36, profession: "Teacher"}
// ]

// var hobbiesData = [
//         {id : '1', title : 'Programming', description : 'Coding', userId : '1'},
//         {id : '2', title : 'Rowing', description : 'Like swimming I guess', userId : '4'},
//         {id : '3', title : 'Swimming', description : 'Like rowing I guess', userId : '1'},
//         {id : '4', title : 'Fencing', description : 'Like fighting', userId : '3'},
//         {id : '5', title : 'Hiking', description : 'Trekking', userId : '3'},
//         {id : '4', title : 'Rock climbing', description : 'Like climbing', userId : '1'},
//         {id : '5', title : 'Jogging', description : 'Like running', userId : '2'}
// ]

// var postsData = [
//     {id : '1', comment : 'Body Building', userId : '1'},
//     {id : '2', comment : 'Graphql is soo hot', userId : '1'},
//     {id : '3', comment : 'Hello GraphQL', userId : '2'},
//     {id : '4', comment : 'House Building', userId : '3'},
//     {id : '5', comment : 'React is soo Cool', userId : '4'},
//     {id : '6', comment : 'Woow iLove GraphQL', userId : '5'}
// ]

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
}= graphql

const UserType = new GraphQLObjectType({
    name : 'User',
    description : 'Documentation of a user type',
    fields : ()=>({
        id : {type : GraphQLID},
        name : {type : GraphQLString},
        age : {type : GraphQLInt},
        profession : {type : GraphQLString},
        hobbies:{
            type : GraphQLList(HobbyType),
            resolve(parent, args){
                //return _.filter(hobbiesData, {userId : parent.id})
               let hobbyParams = {userId : parent.id}
               return Hobby.find(hobbyParams)
            }
        },
        posts : {
            type : GraphQLList(PostType),
            resolve(parent, args){
                //return _.filter(postsData, {userId : parent.id})
                let postParams = {userId : parent.id}
                return Post.find(postParams)
            }
        }
    })
})

const HobbyType = new GraphQLObjectType({
    name : 'Hobby',
    description : "Hobby description",
    fields : ()=>({
        id : {type : GraphQLID},
        title : {type : GraphQLString},
        description : {type : GraphQLString},
        user : {
            type : UserType,
            resolve(parent,args){
                return User.findById(parent.userId)
                //return _.find(usersData, {id : parent.userId})
            }
        },
    })
})

const PostType = new GraphQLObjectType({
    name : 'post',
    description : 'Post description',
    fields : ()=>({
        id : {type : GraphQLID},
        comment : {type : GraphQLString},
        user:{
            type : UserType,
            resolve : (parent, args)=>{
                return User.findById(parent.userId)
                //return _.find(usersData, {id : parent.userId})
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name : 'RootQueryType',
    description : "Description",
    fields : {
        user : {
            type : UserType,
            args : {id : {type : GraphQLString}},
            resolve(parent, args){
                return User.findById(args.id)
                //return _.find(usersData , {id : args.id})
            }
        },
        users : {
            type : GraphQLList(UserType),
            resolve(parent, args){
                //return usersData
                return User.find()
            }
        },
        hobby : {
            type : HobbyType,
            args : {id : {type : GraphQLID}},
            resolve(parent, args){
                return Hobby.findById(args.id)
                //return _.find(hobbiesData, {id : args.id})
            }
        },
        hobbies :{
            type : GraphQLList(HobbyType),
            resolve(parent, args){
                //return hobbiesData
                return Hobby.find()
            }
        },
        post : {
            type : PostType,
            args : {id : {type : GraphQLID}},
            resolve(parent, args){
                //return _.find(postsData, {id : args.id})
                return Post.findById(args.id)
            }
        },
        posts : {
            type : GraphQLList(PostType),
            resolve(parent, args){
                //return postsData
                return Post.find()
            }
        }

    }
})

const Mutation = new GraphQLObjectType({
    name : 'Mutation',
    fields : {
        createUser : {
            type : UserType,
            args : {
                name : {type : new GraphQLNonNull(GraphQLString)},
                age : {type : new GraphQLNonNull(GraphQLInt)},
                profession : {type : GraphQLString},
            },
            resolve(parent, args){
                let user = new User({
                    name : args.name,
                    age : args.age,
                    profession : args.profession
                })
                user.save()
                return user
            }
        },
        updateUser :{
            type : UserType,
            args : {
                id : {type : new GraphQLNonNull(GraphQLID)},
                name : {type : new GraphQLNonNull(GraphQLString)},
                age : {type : new GraphQLNonNull(GraphQLInt)},
                profession : {type : GraphQLString},
            },
            resolve(parent, args){
                const updatedUser = User.findByIdAndUpdate(args.id, {
                    $set: {
                        name : args.name,
                        age : args.age,
                        profession : args.profession
                    }
                },   {new : true})
                return updatedUser
            }
        },
        deleteUser : {
            type : UserType,
            args : {
                 id : {type : new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let removeUser = User.findByIdAndRemove(args.id).exec()
                if(!removeUser){
                    throw new('Error')
                }
                return removeUser
                // return User.findByIdAndRemove(args.id)
            }
        },
        createHobby : {
            type : HobbyType,
            args : {
                title : {type : new GraphQLNonNull(GraphQLString)},
                description : {type : new GraphQLNonNull(GraphQLString)},
                userId : {type: GraphQLID}
            },
            resolve(parent, args){
                let hobby = new Hobby({
                    title : args.title,
                    description : args.description,
                    userId : args.userId
                })
                hobby.save()
                return hobby
            }
        },
        updateHobby : {
            type : HobbyType,
            args : {
                id : {type : new GraphQLNonNull(GraphQLString)},
                title : {type : new GraphQLNonNull(GraphQLString)},
                description : {type : new GraphQLNonNull(GraphQLString)},
                userId : {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return updatedHobby = Hobby.findByIdAndUpdate(args.id, {
                    $set:{
                        title : args.title,
                        description : args.description,
                        userId : args.userId,
                    }
                }, {new : true})
            }
        },
        deleteHobby :{
            type : HobbyType,
            args : {
                id : {type : new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let removeHobby = Hobby.findByIdAndRemove(args.id).exec()

                if(!removeHobby){
                    throw new('Error')
                }
                return removeHobby
            }
        },
        createPost : {
            type : PostType,
            args : {
                comment : {type : new GraphQLNonNull(GraphQLString)},
                userId : {type : new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let post = new Post({
                    comment : args.comment,
                    userId : args.userId
                })
            post.save()
            return post
            }
        },
        updatePost : {
            type : PostType,
            args : {
                id : {type : new GraphQLNonNull(GraphQLID)},
                comment : {type : new GraphQLNonNull(GraphQLString)},
                userId : {type : new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                const updatedPost = Post.findByIdAndUpdate(args.id, {
                comment :args.comment,
                userId : args.userId
                }, {new : true})
                return updatedPost
            }
        },
        deletePost :{
            type : PostType,
            args : {
                id : {type : new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let removePost = Post.findByIdAndRemove(args.id).exec()
                
                if(!removePost){
                    throw new('Error')
                }
                return removePost
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query : RootQuery,
    mutation : Mutation
})
