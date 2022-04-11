const aws = require('aws-sdk');
const { v4: uuid } = require('uuid');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const { generateToken } = require('./generateToken');

const dynamodb = new aws.DynamoDB.DocumentClient();

module.exports.validUser = async ({ username, password, email }) => {
    try {
        const hashPassword = await bcrypt.hash(password, 8);

        const user = {
            id: uuid(),
            username,
            email,
            password: hashPassword,
            createdAt: new Date().toISOString(),
        }

        await dynamodb.put({
            TableName: process.env.USER_TABLE_NAME,
            Item: user,
        }).promise();

        const token = await generateToken(user);

        return {
            id: user.id,
            username: user.username,
            token,
        }
    } catch (err) {
        throw new createError.InternalServerError('An unexpected error occurred')
    }
}