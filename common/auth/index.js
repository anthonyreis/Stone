const jwt = require('jsonwebtoken');

const generatePolicy = (principalId, methodArn) => {
    const apiGatewayWildcard = methodArn.split('/', 2).join('/') + '/*';

    return {
        principalId,
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
    };
};


module.exports.auth = (event, context) => {
    try {
        if (!event.headers.authorization) context.fail('Unauthorized');

        const token = event.headers.authorization.replace('Bearer ', '');

        const claims = jwt.verify(token, process.env.JWT_KEY);

        const policy = generatePolicy(claims.id, event.routeArn);

        context.succeed(policy);
    } catch (err) {
        context.fail('Unauthorized');
    }
}