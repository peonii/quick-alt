import { Sequelize, DataTypes } from 'sequelize'

import User from './models/User'

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'points.db'
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
        }
    },
    {
        tableName: 'users',
        sequelize
    }
)

const force = process.argv.includes('--force')

sequelize.sync({ force }).then(async () => {
    console.log('sequelize synced')
    sequelize.close()
}).catch(console.error)