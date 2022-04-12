const jwt = require('jsonwebtoken');

const generatePolicy = (claims, methodArn) => {
    const apiGatewayWildcard = methodArn.split('/', 2).join('/') + '/*';

    return {
        principalId: claims.id,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: 'Allow',
                    Resource: apiGatewayWildcard,
                },
            ],
        },
        context: {...claims}
    };
};


module.exports.auth = (event, context, callback) => {
    try {
        if (!event.headers.authorization) callback('Unauthorized');

        const token = event.headers.authorization.replace('Bearer ', '');

        const claims = jwt.verify(token, process.env.JWT_KEY);

        const policy = generatePolicy(claims, event.routeArn);

        return callback(null, policy)
    } catch (err) {
        return callback('Unauthorized');
    }
}