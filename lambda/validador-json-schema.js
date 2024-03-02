const localizePtBR = require('ajv-i18n/localize/pt-BR');

const Ajv = require('ajv');
const ajvFormats = require('ajv-formats');

const ajv = new Ajv({allErrors: true});
ajvFormats(ajv);

const schemaLiraa = {
    required: [
        'dados',
        'municipio_ibge',
        'municipio_nome',
        'municipio_uf',
        'periodo_fim',
        'periodo_inicio',
    ],
    type: 'object',
    properties: {
        municipio_uf: {
            type: 'string',
        },
        municipio_nome: {
            type: 'string',
        },
        municipio_ibge: {
            type: ['integer', 'string'],
        },
        periodo_inicio: {
            type: 'string',
            format: 'date',
        },
        periodo_fim: {
            type: 'string',
            format: 'date',
        },
        dados: {
            type: 'object',
            properties: {
                iip_aegypti: {
                    type: 'integer',
                    format: 'int32',
                },
                ib_aegypti: {
                    type: 'integer',
                    format: 'int32',
                },
                iip_albopictus: {
                    type: 'integer',
                    format: 'int32',
                },
                ib_albopictus: {
                    type: 'integer',
                    format: 'int32',
                },
                classificacoes_estrato_iip_aegypti: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            quantidade: {
                                type: 'integer',
                                format: 'int32',
                            },
                            percentual: {
                                type: 'integer',
                                format: 'int32',
                            },
                            risco: {
                                type: 'string',
                            },
                        },
                    },
                },
                criadouros_aegypti: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            criadouro: {
                                type: 'object',
                                properties: {
                                    sigla: {
                                        type: 'string',
                                    },
                                },
                            },
                            quantidade: {
                                type: 'integer',
                                format: 'int32',
                            },
                        },
                    },
                },
            },
        },
    },
};

function validadorJsonSchema(jsonData, schema) {
    const validate = ajv.compile(schema);
    const isValid = validate(jsonData);
    if (!isValid) {
        localizePtBR(validate.errors);
    }
    return {
        valid: isValid,
        errors: validate.errors,
    };
}

module.exports = validadorJsonSchema;
module.exports.schemaLiraa = schemaLiraa;
