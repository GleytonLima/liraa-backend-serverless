const validadorJsonSchema = require('./validador-json-schema');

describe('validadorJsonSchema', () => {
    const schemaGenerico = {
        type: 'object',
        properties: {
            name: {type: 'string'},
            age: {type: 'number'},
        },
        required: ['name', 'age'],
    };

    test('deve retornar retornar resultado validado dado input correto', () => {
        const jsonData = {
            name: 'John Doe',
            age: 30,
        };

        const result = validadorJsonSchema(jsonData, schemaGenerico);
        expect(result.valid).toEqual(true);
        expect(result.errors).toBeNull();
    });

    test('deve retornar status invalido com mensagens de erro em português', () => {
        const jsonData = {
            name: 'John Doe',
            age: '30',
        };

        const result = validadorJsonSchema(jsonData, schemaGenerico);
        console.log(result);
        expect(result).toBeDefined();
        expect(result.valid).toEqual(false);
        expect(result.errors[0].message).toMatch(/deve ser um número/);
    });

    test('deve retornar resultado invalido com mensagens de erro em português, propriedade obrigatória', () => {
        const jsonData = {
            name: 'John Doe',
        };

        const result = validadorJsonSchema(jsonData, schemaGenerico);
        expect(result).toBeDefined();
        expect(result.valid).toEqual(false);
        expect(result.errors[0].message).toMatch(/deve ter a propriedade obrigatória age/);
    });

    test('deve retornar status valido', () => {
        const payload = {
            dados: {
                ib_aegypti: 100,
                ib_albopictus: 50,
                iip_aegypti: 75,
                iip_albopictus: 25,
                classificacoes_estrato_iip_aegypti: [
                    {
                        quantidade: 30,
                        percentual: 40,
                        risco: 'alto',
                    },
                    {
                        quantidade: 20,
                        percentual: 27,
                        risco: 'médio',
                    },
                    {
                        quantidade: 15,
                        percentual: 20,
                        risco: 'baixo',
                    },
                    {
                        quantidade: 5,
                        percentual: 7,
                        risco: 'muito baixo',
                    },
                ],
                criadouros_aegypti: [
                    {
                        criadouro: {
                            sigla: 'TP',
                        },
                        quantidade: 10,
                    },
                    {
                        criadouro: {
                            sigla: 'LT',
                        },
                        quantidade: 20,
                    },
                    {
                        criadouro: {
                            sigla: 'C',
                        },
                        quantidade: 5,
                    },
                ],
            },
            ib_aegypti: 100,
            ib_albopictus: 50,
            iip_aegypti: 75,
            iip_albopictus: 25,
            municipio_ibge: '1234567',
            municipio_nome: 'Exemplo',
            municipio_uf: 'SP',
            periodo_fim: '2023-04-30',
            periodo_inicio: '2023-04-01',
        };
        const result = validadorJsonSchema(payload, validadorJsonSchema.schemaLiraa);
        expect(result.valid).toEqual(true);
        expect(result.errors).toBeNull();
    });

    test('deve retornar status valido string', () => {
        const payload = '';

        const result = validadorJsonSchema(payload, validadorJsonSchema.schemaLiraa);

        expect(result.valid).toEqual(false);
        expect(result.errors).toEqual([
            {
                instancePath: '',
                schemaPath: '#/type',
                keyword: 'type',
                params: {type: 'object'},
                message: 'deve ser object',
            },
        ]);
    });

    test('deve retornar resultado invalido com mensagens de erro em português, schema liraa', () => {
        const jsonData = {};

        const result = validadorJsonSchema(jsonData, validadorJsonSchema.schemaLiraa);
        expect(result).toBeDefined();
        expect(result.valid).toEqual(false);
        expect(result.errors).toEqual([
            {
                instancePath: '',
                keyword: 'required',
                message: 'deve ter a propriedade obrigatória dados',
                params: {
                    missingProperty: 'dados',
                },
                schemaPath: '#/required',
            },
            {
                instancePath: '',
                keyword: 'required',
                message: 'deve ter a propriedade obrigatória municipio_ibge',
                params: {
                    missingProperty: 'municipio_ibge',
                },
                schemaPath: '#/required',
            },
            {
                instancePath: '',
                keyword: 'required',
                message: 'deve ter a propriedade obrigatória municipio_nome',
                params: {
                    missingProperty: 'municipio_nome',
                },
                schemaPath: '#/required',
            },
            {
                instancePath: '',
                keyword: 'required',
                message: 'deve ter a propriedade obrigatória municipio_uf',
                params: {
                    missingProperty: 'municipio_uf',
                },
                schemaPath: '#/required',
            },
            {
                instancePath: '',
                keyword: 'required',
                message: 'deve ter a propriedade obrigatória periodo_fim',
                params: {
                    missingProperty: 'periodo_fim',
                },
                schemaPath: '#/required',
            },
            {
                instancePath: '',
                keyword: 'required',
                message: 'deve ter a propriedade obrigatória periodo_inicio',
                params: {
                    missingProperty: 'periodo_inicio',
                },
                schemaPath: '#/required',
            },
        ]);
    });
});
