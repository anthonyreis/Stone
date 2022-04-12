const aws = require('aws-sdk');
const { v4: uuid } = require('uuid');
const createError = require('http-errors');

const dynamodb = new aws.DynamoDB.DocumentClient();

module.exports.createUser = async (username, hashPassword) => {
    try {
        const user = {
            id: uuid(),
            username,
            password: hashPassword,
            createdAt: new Date().toISOString(),
        }
    
        await dynamodb.put({
            TableName: process.env.USER_TABLE_NAME,
            Item: user
        }).promise();

        return {
            username: user.username,
            id: user.id,
        }
    } catch(err) {
        return {
            statusCode: err.statusCode ?? 500,
            body: JSON.stringify({
                message: err.message ? err.message : 'An unexpected error occurred'
            })
        }
    }
   
}