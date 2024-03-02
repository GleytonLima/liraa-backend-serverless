'use strict';
const validadorJsonSchema = require('./validador-json-schema');
const {publishSnsMessage} = require('./adapters/sns-adapter');

exports.handler = async (event, context) => {
    try {
        console.log('Evento recebido: ', event);
        const groups = event.requestContext.authorizer.claims['cognito:groups'];
        console.log('Grupos', groups);
        if (!groups.includes('user-group') && !groups.includes('admin-group')) {
            return {
                statusCode: 403,
                isBase64Encoded: false,
                headers: {'content-type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                body: JSON.stringify({
                    type: 'https://httpstatuses.com/403',
                    title: 'Acesso negado',
                    status: 403,
                    detail: 'Usuário não tem permissão para enviar registros. Precisar ser do grupo user-group. Entre em contato com o administrador do sistema.',
                }),
            };
        }
        const eventBodyString = event.body;

        const eventBody = converterStringEmObjeto(eventBodyString);

        const resultado = validadorJsonSchema(eventBody, validadorJsonSchema.schemaLiraa);
        if (!resultado.valid) {
            console.error('Erro de validação: ', resultado.errors);
            return {
                statusCode: 400,
                isBase64Encoded: false,
                headers: {'content-type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                body: JSON.stringify({
                    type: 'https://httpstatuses.com/400',
                    title: 'Erro de validação',
                    status: 400,
                    detail: resultado.errors,
                }),
            };
        }
        console.log('Claims', JSON.stringify(event.requestContext.authorizer.claims));
        const {sub, email} = event.requestContext.authorizer.claims;
        const name = event.requestContext.authorizer.claims['cognito:username'];
        console.log(`Usuário: ${sub} (${name}). Registro validado: ${eventBodyString}`);
        const levantamento = {
            registro: JSON.parse(eventBodyString),
            dados_recebimento: {
                dataHora: new Date().toISOString(),
                idLote: context.awsRequestId,
                usuario: {
                    id: sub,
                    nome: name,
                    email: email,
                },
            },
        };
        const topicArn = `arn:aws:sns:${process.env.AWS_REGION}:${
            context.invokedFunctionArn.split(':')[4]
        }:liraa-registros-validados`;

        await publishSnsMessage(levantamento, topicArn);

        return {
            statusCode: 200,
            isBase64Encoded: false,
            headers: {'content-type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            body: JSON.stringify(levantamento),
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

function converterStringEmObjeto(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return str;
    }
}
