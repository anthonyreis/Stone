const { v4: uuid } = require('uuid');
const {validUser} = require('../functions/validUser')
const { handler } = require('../handler');
const { validator } = require('../validations/validator');
const createError = require('http-errors');

let user = {};
let password = '';
jest.mock('../functions/validUser');
jest.mock('../validations/validator');
describe('When validUser is called', () => {
    beforeAll(() => {
        user = {
            id: uuid(),
            username: 'anthony',
            token: 'd56as44444444454a6fas654fa6s54a4sgas65g465sfd4'
        }

        password = 'pass1234'
    })

    it('Should return the user data', async () => {
        validator.mockReturnValueOnce();

        validUser.mockReturnValueOnce(user)

        const result = await handler({body: {username: user.username, password}});

        expect(result).toStrictEqual({ 
            statusCode: 201,
            body: JSON.stringify({
                message: `User ${user.username} created successfully with id ${user.id}`,
                token: user.token,
            })
        })
    })

    it('Should return an error because the user already exists', async () => {
        validator.mockReturnValueOnce();

        validUser.mockReturnValueOnce({
            statusCode: 400,
            body: JSON.stringify({
                message: 'An user with this username already exists'
            })
        })

        const result = await handler({body: {username: user.username, password}});

        expect(result).toStrictEqual({
            statusCode: 400,
            body: JSON.stringify({
                message: 'An user with this username already exists'
            })
        })
    })

    it('Should return an error because of missing param', async () => {
        validator.mockImplementationOnce(() => {throw new createError.BadRequest('"password" is required')});

        const result = await handler({body: {username: user.username}});

        expect(result).toStrictEqual({
            statusCode: 400,
            body: JSON.stringify({
                message: '"password" is required'
            })
        })
    })

    it('Should return an error because of problem creating user', async () => {
        validator.mockReturnValueOnce();

        validUser.mockReturnValueOnce({
            statusCode: 500,
            body: JSON.stringify({
                message: 'An unexpected error occurred'
            })
        })

        const result = await handler({body: {username: user.username, password}});

        expect(result).toStrictEqual({
            statusCode: 500,
            body: JSON.stringify({
                message: 'An unexpected error occurred'
            })
        })
    })
})