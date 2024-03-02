const {handler} = require('./validador');
const validadorJsonSchema = require('./validador-json-schema');
const snsAdapter = require('./adapters/sns-adapter');

jest.mock('./adapters/sns-adapter', () => {
    return {
        publishSnsMessage: jest.fn(),
    };
});

jest.mock('./validador-json-schema');

mockContext = {
    awsRequestId: '123',
    invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:my-function',
};

describe('Handler tests', () => {
    beforeEach(() => {
        validadorJsonSchema.mockReset();
        snsAdapter.publishSnsMessage.mockReset();
    });

    test('Deve tratar evento valido', async () => {
        const event = {
            body: '{}',
            requestContext: {
                authorizer: {
                    claims: {
                        'sub': '123',
                        'email': 'test@example.com',
                        'cognito:user': 'Test User',
                        'cognito:groups': ['user-group'],
                    },
                },
            },
        };
        validadorJsonSchema.mockImplementation(() => ({valid: true}));

        snsAdapter.publishSnsMessage.mockResolvedValue();

        const result = await handler(event, mockContext);

        expect(result.statusCode).toBe(200);
        expect(validadorJsonSchema).toHaveBeenCalledWith(JSON.parse(event.body), validadorJsonSchema.schemaLiraa);
        expect(snsAdapter.publishSnsMessage).toHaveBeenCalled();
    });

    test('Deve tratar evento invalido', async () => {
        const event = {
            body: 'invalidBody',
            requestContext: {
                authorizer: {
                    claims: {
                        'sub': '123',
                        'email': 'test@example.com',
                        'cognito:user': 'Test User',
                        'cognito:groups': ['user-group'],
                    },
                },
            },
        };
        const validationResult = {
            valid: false,
            errors: ['error1', 'error2'],
        };
        validadorJsonSchema.mockImplementation(() => validationResult);

        const result = await handler(event, mockContext);

        expect(result.statusCode).toBe(400);
        expect(validadorJsonSchema).toHaveBeenCalledWith(event.body, validadorJsonSchema.schemaLiraa);
        expect(result.body).toEqual(
            JSON.stringify({
                type: 'https://httpstatuses.com/400',
                title: 'Erro de validação',
                status: 400,
                detail: validationResult.errors,
            }),
        );
        expect(snsAdapter.publishSnsMessage).not.toHaveBeenCalled();
    });

    test('Deve tratar falha na posta do evento SNS', async () => {
        const event = {
            body: '{"foo": "bar"}',
            requestContext: {
                authorizer: {
                    claims: {
                        'sub': '123',
                        'email': 'test@example.com',
                        'cognito:user': 'Test User',
                        'cognito:groups': ['user-group'],
                    },
                },
            },
        };
        validadorJsonSchema.mockImplementation(() => ({valid: true}));
        snsAdapter.publishSnsMessage.mockRejectedValue(new Error('SNS publish error'));

        const result = await handler(event, mockContext);

        expect(result.statusCode).toBe(500);
        expect(validadorJsonSchema).toHaveBeenCalledWith(JSON.parse(event.body), validadorJsonSchema.schemaLiraa);
        expect(snsAdapter.publishSnsMessage).toHaveBeenCalled();
    });

    test('Deve tratar unknown error', async () => {
        const event = {
            body: 'validBody',
            requestContext: {
                authorizer: {
                    claims: {
                        'sub': '123',
                        'email': 'test@example.com',
                        'cognito:user': 'Test User',
                        'cognito:groups': ['user-group'],
                    },
                },
            },
        };
        const unknownError = new Error('Unknown error');
        validadorJsonSchema.mockImplementation(() => {
            throw unknownError;
        });

        const result = await handler(event, mockContext);

        expect(result.statusCode).toBe(500);
        expect(validadorJsonSchema).toHaveBeenCalledWith(event.body, validadorJsonSchema.schemaLiraa);
        expect(result.body).toEqual(
            JSON.stringify({
                type: 'https://httpstatuses.com/500',
                title: 'Erro interno',
                status: 500,
                detail: unknownError,
            }),
        );
        expect(snsAdapter.publishSnsMessage).not.toHaveBeenCalled();
    });
});
