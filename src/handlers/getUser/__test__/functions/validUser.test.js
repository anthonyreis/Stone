const aws = require('aws-sdk');
const { v4: uuid } = require('uuid');
const createError = require('http-errors');
const { validUser } = require('../../functions/validUser');

let user = {};
jest.mock('aws-sdk')
describe('When validUser is called', () => {
    beforeAll(() => {
        user = {
            id: uuid(),
            username: 'anthony',
            email: 'anthony@gmail.com'
        }
    })
    it('Should return the user data', async () => {
        aws.DynamoDB.DocumentClient.prototype.get.mockImplementationOnce(() => ({ promise: () => ({Item: user})}))
        const result = await validUser(user.id);

        expect(result).toStrictEqual(user)
    })

    it('Should return an error because the user wasnt found', async () => {
        aws.DynamoDB.DocumentClient.prototype.get.mockImplementationOnce(() => ({ promise: () => ({})}))
       
        const result = await validUser(user.id);

        expect(result).toStrictEqual({
            statusCode: 404,
            body: JSON.stringify({
                message: 'User not found'
            })
        })
    })

    it('Should return an unexpected error when connecting to db', async () => {
        aws.DynamoDB.DocumentClient.prototype.get.mockImplementationOnce(() => ({ promise: () => {throw new Error()}}))
       
        const result = await validUser(user.id);

        expect(result).toStrictEqual({
            statusCode: 500,
            body: JSON.stringify({
                message: 'An unexpected error occurred'
            })
        })
    })
})