'use strict';
const {listarLevantamentos, deletarLevantamento} = require('./adapters/database-adapter');

const extrairFilterOptions = (event) => {
    if (event.queryStringParameters) {
        const filter = {};
        if (event.queryStringParameters.municipio_uf) {
            filter['registro.municipio_uf'] = event.queryStringParameters.municipio_uf;
        }
        if (event.queryStringParameters.municipio_ibge) {
            filter['registro.municipio_ibge'] = parseInt(event.queryStringParameters.municipio_ibge);
        }
        if (event.queryStringParameters.periodo_inicio && event.queryStringParameters.periodo_fim) {
            filter['registro.periodo_inicio'] = {
                $gte: event.queryStringParameters.periodo_inicio,
                $lte: event.queryStringParameters.periodo_fim,
            };
        }

        const options = {};

        const limit = event.queryStringParameters.limit !== undefined ? event.queryStringParameters.limit : 10;
        options.limit = parseInt(limit);

        const offset = event.queryStringParameters.offset !== undefined ? event.queryStringParameters.offset : 0;
        options.offset = parseInt(offset);

        if (event.queryStringParameters.sort) {
            options.sort = {};
            const sortFields = event.queryStringParameters.sort.split(',');
            sortFields.forEach((field) => {
                const sortValue = field.startsWith('-') ? -1 : 1;
                const fieldName = field.startsWith('-') ? field.substring(1) : field;
                if (fieldName == 'periodo_inicio' || fieldName == 'periodo_fim') {
                    options.sort[`registro.${fieldName}`] = sortValue;
                }
            });
        }
        return {
            filter,
            options,
        };
    }
    return {
        filter: {},
        options: {
            limit: 10, 
            offset: 0, 
            sort: {}
        },
    };
};

const handler = async (event, context) => {
    try {
        console.log('Evento recebido: ', event);
        const {sub} = event.requestContext.authorizer.claims;
        const name = event.requestContext.authorizer.claims['cognito:username'];
        console.log(`Usuário: ${sub} (${name})`);
        const groups = event.requestContext.authorizer.claims['cognito:groups'];
        console.log(`Grupos: ${groups}`);

        if (!groups.includes('admin-group')) {
            return {
                statusCode: 403,
                isBase64Encoded: false,
                headers: {'content-type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                body: JSON.stringify({
                    type: 'https://httpstatuses.com/403',
                    title: 'Acesso negado',
                    status: 403,
                    detail: 'Usuário não autorizado',
                }),
            };
        }

        if (event.httpMethod === 'DELETE') {
            const id = event.pathParameters.id;
            await deletarLevantamento(id);
            return {
                statusCode: 204,
                isBase64Encoded: false,
                headers: {'content-type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                body: JSON.stringify({}),
            };
        }

        const {filter, options} = extrairFilterOptions(event);

        const levantamentos = await listarLevantamentos(filter, options);

        return {
            statusCode: 200,
            isBase64Encoded: false,
            headers: {'content-type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            body: JSON.stringify({
                results: levantamentos.data,                
                total: levantamentos.total,
                offset: options.offset,
                limit: options.limit
            }),
        };
    } catch (error) {
        console.error(`error: ${error}`);
        return {
            statusCode: 500,
            isBase64Encoded: false,
            headers: {'content-type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            body: JSON.stringify({
                type: 'https://httpstatuses.com/500',
                title: 'Erro interno',
                status: 500,
                detail: error,
            }),
        };
    }
};

module.exports = {handler, extrairFilterOptions};
