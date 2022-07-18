import { InferAttributes, InferCreationAttributes, Model } from "sequelize"

export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: string
    declare points: number
    declare lastChallenge?: Date
    declare lastChallengeStop?: string
}
