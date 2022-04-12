const { v4: uuid } = require('uuid');
const { generateToken } = require('../../functions/generateToken');
const { validUser } = require('../../functions/validUser');
const { createUser } = require('../../functions/createUser');
const { uniqueUser } = require('../../functions/uniqueUser');

let params = {};
let token = '';
let hashPassword = '';
let id = '';
jest.mock('../../functions/generateToken');
jest.mock('../../functions/createUser');
jest.mock('../../functions/uniqueUser')
describe('When validUser is called', () => {
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
        uniqueUser.mockReturnValueOnce({});
        createUser.mockReturnValueOnce({username: params.username, password: hashPassword, id})
        generateToken.mockReturnValueOnce(token);

        const result = await validUser(params);

        expect(result).toStrictEqual({
            username: params.username,
            id,
            token
        })
    })

    it('Should return an error because the user already exists', async () => {
        uniqueUser.mockReturnValueOnce({
            statusCode: 400,
            body: JSON.stringify({
                message: 'An user with this username already exists'
            })
        });

        const result = await validUser(params);

        expect(result).toStrictEqual({
            statusCode: 400,
            body: JSON.stringify({
                message: 'An user with this username already exists'
            })
        })
    })

    it('Should return an unexpected error when connecting to db', async () => {
        uniqueUser.mockReturnValueOnce({});
        createUser.mockReturnValueOnce({
            statusCode: 500,
            body: JSON.stringify({
                message: 'An unexpected error occurred'
            })
        })

        const result = await validUser(params);

        expect(result).toStrictEqual({
            statusCode: 500,
            body: JSON.stringify({
                message: 'An unexpected error occurred'
            })
        })
    })

    it('Should return an unexpected error wheen generate token fails', async () => {
        uniqueUser.mockReturnValueOnce({});
        createUser.mockReturnValueOnce({username: params.username, password: hashPassword, id})
        generateToken.mockReturnValueOnce({
            statusCode: 500,
            body: JSON.stringify({
                message: 'An unexpected error occurred'
            })
        });

        const result = await validUser(params);

        expect(result).toStrictEqual({
            statusCode: 500,
            body: JSON.stringify({
                message: 'An unexpected error occurred'
            })
        })
    })
})