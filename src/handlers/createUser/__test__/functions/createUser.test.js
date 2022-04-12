const aws = require('aws-sdk');
const { v4: uuid } = require('uuid');
const { createUser } = require('../../functions/createUser');

let params = {};
let token = '';
let hashPassword = '';
let id = '';
jest.mock('aws-sdk');
describe('When createUser is called', () => {
    beforeAll(() => {
        params = {
            username: 'anthony',
            password: 'senha123',
        }

        token = 'd56as44444444454a6fas654fa6s54a4sgas65g465sfd4'

        hashPassword = '5d4as54g6a41gb5fs1f8asf78'

        id = uuid();

    })
    it('Should return the user data', async () => {
        aws.DynamoDB.DocumentClient.prototype.put.mockImplementationOnce(() => ({ promise: () => ({})}))

        const result = await createUser(params.username, hashPassword);

        expect(result).toHaveProperty('username');
        expect(result.username).toEqual(params.username);
        expect(result).toHaveProperty('id');
    })

    it('Should return an error because of problem to connect to db', async () => {
        aws.DynamoDB.DocumentClient.prototype.put.mockImplementationOnce(() => ({ promise: () => {throw new Error()}}))
       
        const result = await createUser(params, hashPassword);

        expect(result).toStrictEqual({
            statusCode: 500,
            body: JSON.stringify({
                message: 'An unexpected error occurred'
            })
        })
    })
})