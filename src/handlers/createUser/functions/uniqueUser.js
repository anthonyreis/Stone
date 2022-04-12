const aws = require('aws-sdk');

const dynamodb = new aws.DynamoDB.DocumentClient();

module.exports.uniqueUser = async ({username}) => {
    const params = {
        TableName: process.env.USER_TABLE_NAME,
        IndexName: 'username',
        KeyConditionExpression: 'username = :username',
        ExpressionAttributeValues: {
            ':username': username
        },
    }

    const users = await dynamodb.query(params).promise();

    if (users.Items.length > 0) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'An user with this username already exists'
            })
        }
    }

    return {}
}