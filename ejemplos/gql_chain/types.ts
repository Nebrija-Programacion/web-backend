import {OptionalId, ObjectId} from "mongodb"

export type UserModel = OptionalId<{
    name: string,
    email: string,
    friends: ObjectId[],
}>

export type User = {
    id: string,
    email: string,
    friends: User[],
    numberOfFriends: number,
}