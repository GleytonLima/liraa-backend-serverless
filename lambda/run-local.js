const {handler} = require('./gerenciar-levantamentos.js');


run = async () => {
    const awsApiGatewayExemplo = {
        requestContext: {
            authorizer: {
                claims: {
                    'sub': '1234567890',
                    'cognito:username': 'username',
                },
            },
        },
        queryStringParameters: {
            municipio_uf: 'AM',
            municipio_ibge: '1300706',
            periodo_inicio: '2023-01-01',
            periodo_fim: '2024-05-31',
            limit: '10',
            offset: '0',
            sort: 'periodo_inicio',
        },
    };

    const response = await handler(awsApiGatewayExemplo);

    console.log(response);
};

run();
