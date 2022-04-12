const aws = require('aws-sdk');
const { v4: uuid } = require('uuid');
const { uniqueUser } = require('../../functions/uniqueUser');

let params = {};
let hashPassword = '';
let id = '';
jest.mock('aws-sdk');
describe('When createUser is called', () => {
    beforeAll(() => {
        params = {
            username: 'anthony',
            password: 'senha123',
        }

        hashPassword = '5d4as54g6a41gb5fs1f8asf78'

        id = uuid();

    })
    it('Should return error 400 because user already exists with this username', async () => {
        aws.DynamoDB.DocumentClient.prototype.query.mockImplementationOnce(() => ({ promise: () => ({Items:[{username: params.username, password: hashPassword, id}]})}))

        const result = await uniqueUser(params.username);

        expect(result).toStrictEqual({
            statusCode: 400,
            body: JSON.stringify({
                message: 'An user with this username already exists'
            })
        })
    })

    it('Should return an empty object because no user with the username was found', async () => {
        aws.DynamoDB.DocumentClient.prototype.query.mockImplementationOnce(() => ({ promise: () => ({Items:[]})}))
       
        const result = await uniqueUser(params.username);

        expect(result).toStrictEqual({})
    })
})