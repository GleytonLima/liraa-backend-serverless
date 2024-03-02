const {handler, extrairFilterOptions} = require('./gerenciar-levantamentos');
const {listarLevantamentos} = require('./adapters/database-adapter');

jest.mock('./adapters/database-adapter');

describe('Testes para gerenciar-levantamentos.js', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Teste para a função handler com sucesso', async () => {
        const mockEvent = {
            requestContext: {
                authorizer: {
                    claims: {
                        'sub': '123',
                        'cognito:username': 'testUser',
                        'cognito:groups': ['admin-group']
                    },
                },
            },
            queryStringParameters: null,
        };

        const mockLevantamentos = {
            total: 1,
            data: ['data1'],
        };

        listarLevantamentos.mockResolvedValue(mockLevantamentos);

        const response = await handler(mockEvent);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(JSON.stringify({
            results: mockLevantamentos.data,            
            total: mockLevantamentos.total,
            offset: 0,
            limit: 10,
        }));
    });

    test('Teste para a função handler com erro', async () => {
        const mockEvent = {
            requestContext: {
                authorizer: {
                    claims: {
                        'sub': '123',
                        'cognito:username': 'testUser',
                        'cognito:groups': ['admin-group']                        
                    },
                },
            },
            queryStringParameters: null,
        };

        listarLevantamentos.mockRejectedValue(new Error('Erro'));

        const response = await handler(mockEvent);

        expect(response.statusCode).toBe(500);
        expect(response.body).toBe(JSON.stringify({
            type: 'https://httpstatuses.com/500',
            title: 'Erro interno',
            status: 500,
            detail: new Error('Erro'),
        }));
    });

    test('Teste para a função extrairFilterOptions', () => {
        const mockEvent = {
            queryStringParameters: {
                municipio_uf: 'UF',
                municipio_ibge: '123',
                periodo_inicio: '2022-01-01',
                periodo_fim: '2022-12-31',
                limit: '10',
                offset: '0',
                sort: 'periodo_inicio,-periodo_fim',
            },
        };

        const result = extrairFilterOptions(mockEvent);
        expect(result).toEqual({
            filter: {
                'registro.municipio_uf': 'UF',
                'registro.municipio_ibge': 123,
                'registro.periodo_inicio': {
                    $gte: '2022-01-01',
                    $lte: '2022-12-31',
                },
            },
            options: {
                limit: 10,
                offset: 0,
                sort: {
                    'registro.periodo_inicio': 1,
                    'registro.periodo_fim': -1,
                },
            },
        });
    });
});
