const aws = require('aws-sdk');
const { v4: uuid } = require('uuid');
const createError = require('http-errors');

const dynamodb = new aws.DynamoDB.DocumentClient();

module.exports.createUser = async ({username}, hashPassword) => {
    try {
        const user = {
            id: uuid(),
            username,
            password: hashPassword,
            createdAt: new Date().toISOString(),
        }
    
        const created = await dynamodb.put({
            TableName: process.env.USER_TABLE_NAME,
            Item: user,
        }).promise();

        return created;
    } catch(err) {
        throw new createError.InternalServerError('An unexpected error occurred')
    }
   
}