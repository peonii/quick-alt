import { Sequelize, DataTypes } from 'sequelize'

import User from './models/User'

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'points.db',
    logging: false
})

User.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // lastChallenge: {
        //     type: DataTypes.DATE,
        // },
        // lastChallengeStop: {
        //     type: DataTypes.STRING,
        // }
    },
    {
        tableName: 'users',
        sequelize
    }
)

export { User }