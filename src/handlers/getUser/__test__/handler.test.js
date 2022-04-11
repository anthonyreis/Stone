const { v4: uuid } = require('uuid');
const {validUser} = require('../functions/validUser')
const { handler } = require('../handler');

let user = {};
jest.mock('../functions/validUser')
describe('When validUser is called', () => {
    beforeAll(() => {
        user = {
            id: uuid(),
            username: 'anthony',
            email: 'anthony@gmail.com'
        }
    })
    it('Should return the user data', async () => {
        validUser.mockReturnValueOnce(user)
        const result = await handler({pathParameters: { id: user.id}});

        expect(result).toStrictEqual({ 
            statusCode: 200,
            body: user
        })
    })

    it('Should return an error because the user wasnt found', async () => {
        validUser.mockReturnValueOnce({
            statusCode: 404,
            body: JSON.stringify({
                message: 'User not found'
            })
        })
        const result = await handler({pathParameters: { id: user.id}});

        expect(result).toStrictEqual({
            statusCode: 404,
            body: JSON.stringify({
                message: 'User not found'
            })
        })
    })

    it('Should return an error because of missing param', async () => {
        const result = await handler({pathParameters: {}});

        expect(result).toStrictEqual({
            statusCode: 400,
            body: JSON.stringify({
                message: '"id" is required'
            })
        })
    })
})