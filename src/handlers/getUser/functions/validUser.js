const aws = require('aws-sdk');
const createError = require('http-errors');

const dynamodb = new aws.DynamoDB.DocumentClient();

module.exports.validUser = async (userId) => {
    try {
        const { Item: user } = await dynamodb.get({
            TableName: process.env.USER_TABLE_NAME,
            Key: { id: userId }
        }).promise();

        if (!user) throw new createError.NotFound('User not found');

        return {
            id: user.id,
            username: user.username,
            email: user.email
        };
    } catch (err) {
        throw new createError.InternalServerError('An unexpected error occurred')
    }
}