const countapi = require('countapi-js');
const createError = require('http-errors');
const { handler } = require('../handler');
const { validator } = require('../validations/validator');

jest.mock('../validations/validator');
jest.mock('countapi-js');
describe('When the handler is called', () => {
    it('Should return the hit at an given key', async () => {
        validator.mockResolvedValueOnce({});
        countapi.hit.mockResolvedValueOnce({ path: 'test' });

        const result = await handler({
            pathParameters: {
                key: 'test'
            }
        }, {});

        expect(result).toStrictEqual({
            statusCode: 200,
            body: JSON.stringify({
                message: 'Hit at test'
            })
        })
    })

    it('Should return an error because of missing param', async () => {
        validator.mockImplementationOnce(() => { throw new createError.BadRequest('"key" is required') });

        const result = await handler({
            pathParameters: {}
        }, {});

        expect(result).toStrictEqual({
            statusCode: 400,
            body: JSON.stringify({
                message: '"key" is required'
            })
        })
    })

    it('Should return an error because of invalid param', async () => {
        validator.mockImplementationOnce(() => { throw new createError.BadRequest('"key" with value "abc," fails to match the required pattern: /^[A-Za-z0-9_\\-.]{3,64}$/') });

        const result = await handler({
            pathParameters: {
                key: 'abc,'
            }
        }, {});

        expect(result).toStrictEqual({
            statusCode: 400,
            body: JSON.stringify({
                message: '"key" with value "abc," fails to match the required pattern: /^[A-Za-z0-9_\\-.]{3,64}$/'
            })
        })
    })

    it('Should return an error because of error to hit the counter endpoint', async () => {
        validator.mockResolvedValueOnce({});
        countapi.hit.mockImplementationOnce(() => { throw new Error() });

        const result = await handler({
            pathParameters: {
                key: 'abc'
            }
        }, {});

        expect(result).toStrictEqual({
            statusCode: 500,
            body: JSON.stringify({
                message: 'An unexpected error occurred'
            })
        })
    })
})