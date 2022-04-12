const { v4: uuid } = require('uuid');
const {validUser} = require('../functions/validUser')
const { handler } = require('../handler');

let user = {};
let event = {};
jest.mock('../functions/validUser')
describe('When validUser is called', () => {
    beforeAll(() => {
        user = {
            id: uuid(),
            username: 'anthony',
            email: 'anthony@gmail.com'
        }

        event = {
            pathParameters: {
                id: user.id
            },
            requestContext: {
                authorizer: {
                    lambda: {
                        id: user.id,
                        username: user.username
                    }
                }
            }
        }
    })
    it('Should return the user data', async () => {
        validUser.mockReturnValueOnce(user)
        const result = await handler(event);

        expect(result).toStrictEqual({ 
            statusCode: 200,
            body: JSON.stringify(user)
        })
    })

    it('Should return an error because the user wasnt found', async () => {
        validUser.mockReturnValueOnce({
            statusCode: 404,
            body: JSON.stringify({
                message: 'User not found'
            })
        })
        const result = await handler(event);

        expect(result).toStrictEqual({
            statusCode: 404,
            body: JSON.stringify({
                message: 'User not found'
            })
        })
    })

    it('Should return an error because of missing param', async () => {
        const result = await handler({...event, pathParameters: {}});

        expect(result).toStrictEqual({
            statusCode: 400,
            body: JSON.stringify({
                message: '"id" is required'
            })
        })
    })

    it('Should return an error because given id doesnt match the one from jwt', async () => {
        const result = await handler({...event, requestContext: {authorizer: {lambda: {id: uuid()}}}});

        expect(result).toStrictEqual({
            statusCode: 403,
            body: JSON.stringify({
                message: 'You cant access information from this user'
            })
        })
    })
})