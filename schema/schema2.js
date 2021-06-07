const { graphqlHTTP } = require('express-graphql')
const graphql = require('graphql')
const { result } = require('lodash')
const _ = require('lodash')

const PlayersData = [
    {id : "1", name : "Ronaldo", rating : 95, position : "Forward" },
    {id : "2", name : "Messi", rating : 97, position : "Forward" },
    {id : "3", name : "Salla", rating : 85, position : "Forward" },
    {id : "4", name : "Neyma", rating : 89, position : "Forward" },
    {id : "5", name : "Lewandoski", rating : 85, position : "Forward" },
]

const SkillsData = [
    {id : "1", skilltype : "Running", playerId : "2" },
    {id : "2", skilltype : "Dribble", playerId : "1" },
    {id : "3", skilltype : "Passing", playerId : "3" },
    {id : "4", skilltype : "Shot power", playerId : "4"},
    {id : "5", skilltype : "Stamina", playerId : "5"},
    {id : "6", skilltype : "Mentality", playerId : "1" },
]

const ClubsData = [
    {id : "1", name : "Bacelona", playerId :"1" },
    {id : "2", name : "Juventus", playerId : "4" },
    {id : "3", name : "Liverpool", playerId : "2" },
    {id : "4", name : "Chelsea", playerId : "3" },
    {id : "5", name : "Inter Millan", playerId : "5" },
    {id : "6", name : "Ajax", playerId : "3" },
]

const {GraphQLObjectType, GraphQLString, GraphQLInt, 
    GraphQLID, GraphQLList, GraphQLSchema,} = graphql

const PlayerType = new GraphQLObjectType({
    name : "player",
    fields : ()=>({
        id : {type : GraphQLID},
        name : {type : GraphQLString},
        rating : {type : GraphQLInt},
        position : {type : GraphQLString},
        skills: {
            type : GraphQLList(SkillsType),
            resolve(parent, args){
                return _.filter(SkillsData, {playerId : parent.id} )
            }
        },
        clubs : {
            type : GraphQLList(ClubType),
            resolve(parent, args){
                return _.filter(ClubsData, {playerId : parent.id})
            }
        }
    })
})

const SkillsType = new GraphQLObjectType({
    name : "skill",
    fields : ()=>({
        id : {type: GraphQLID},
        skilltype :{type: GraphQLString},
        player : {
            type : PlayerType,
            resolve(parent, args){
                return _.find(PlayersData, {id: parent.playerId})
            }
        }
    })
})

const ClubType = new GraphQLObjectType({
    name : 'club',
    fields : ()=>({
        id : {type : GraphQLID},
        name : {type : GraphQLString},
        player : {
            type : PlayerType,
            resolve(parent, args){
                return _.find(PlayersData, {id : parent.playerId })
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name : 'RootQuetyType',
    fields : {
        player : {
            type : PlayerType,
            args : {id : {type : GraphQLID}},
            resolve(parent, args){
                return _.find(PlayersData, {id : args.id}) 
            }
        },
        players :{
            type : GraphQLList(PlayerType),
            resolve(parent, args){
                return PlayersData
            }
        },
        skill :{
            type : SkillsType,
            args : {id : {type : GraphQLID}},
            resolve(parent, args){
                return _.find(SkillsData , {id : args.id})
            }
        },
        skills :{
            type : GraphQLList(SkillsType),
            resolve(parent, args){
                return SkillsData
            }
        },
        club :{
            type : ClubType,
            args : {id : {type : GraphQLID}},
            resolve(parent, args){
                return _.find(ClubsData, {id : args.id})
            }
        },
        clubs : {
            type :GraphQLList(ClubType),
            resolve(parent, args){
                return ClubsData
            }
        }
    }
})


const Mutation = new GraphQLObjectType({
    name : "Mutation",
    fields : ()=>({
        createPlayer : {
            type : PlayerType,
            args : {
                name : {type : GraphQLString},
                rating : {type : GraphQLInt},
                position : {type : GraphQLString},
                // skills : {type : SkillsType},
                // clubs : {type : ClubType},
            },
            resolve(parent, args){
                let player = {
                    name : args.name,
                    rating : args.rating,
                    position : args.position,
                    // skills : args.skills,
                    // clubs : args.clubs
                }
                return player

            }
        },
        createSkill :{
            type : SkillsType,
            args : {
                skilltype : {type : GraphQLString},
                playerId : {type : GraphQLID}
            },
            resolve(parent, args){
                let skill = {
                    skilltype : args.skilltype,
                    playerId : args.playerId
                }
                return skill
            }
        },
        createClub : {
            type : ClubType,
            args : {
                name : {type : GraphQLString},
                playerId : {type : GraphQLID},
            },
            resolve(parent, args){
                let club = {
                    name : args.name,
                    playerId : args.playerId
                }
                return club
            }
        }
    })
})
module.exports = new GraphQLSchema({
    query : RootQuery,
    mutation :  Mutation 
}) 