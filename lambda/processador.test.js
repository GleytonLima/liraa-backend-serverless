const {handler} = require('./processador');
const {inserirDocumento} = require('./adapters/database-adapter');

jest.mock('./adapters/database-adapter', () => ({
    inserirDocumento: jest.fn(),
}));
const mensagemJson = {
    "_id": "65e1f1369b68f039e01fd71f",
    "registro": {
        "dados": {
            "ib_aegypti": 100,
            "ib_albopictus": 50,
            "iip_aegypti": 75,
            "iip_albopictus": 25,
            "classificacoes_estrato_iip_aegypti": [
                {
                    "quantidade": 1,
                    "percentual": 25,
                    "risco": "alto"
                },
                {
                    "quantidade": 1,
                    "percentual": 25,
                    "risco": "médio"
                },
                {
                    "quantidade": 2,
                    "percentual": 50,
                    "risco": "baixo"
                }
            ],
            "criadouros_aegypti": [
                {
                    "criadouro": {
                        "sigla": "A1"
                    },
                    "quantidade": 1
                },
                {
                    "criadouro": {
                        "sigla": "A2"
                    },
                    "quantidade": 20
                },
                {
                    "criadouro": {
                        "sigla": "C"
                    },
                    "quantidade": 5
                },
                {
                    "criadouro": {
                        "sigla": "D1"
                    },
                    "quantidade": 0
                },
                {
                    "criadouro": {
                        "sigla": "D2"
                    },
                    "quantidade": 0
                },
                {
                    "criadouro": {
                        "sigla": "E"
                    },
                    "quantidade": 1
                }
            ]
        },
        "ib_aegypti": 100,
        "ib_albopictus": 50,
        "iip_aegypti": 75,
        "iip_albopictus": 25,
        "municipio_ibge": "1302603",
        "municipio_nome": "Manaus",
        "municipio_uf": "AM",
        "periodo_fim": "2024-01-30",
        "periodo_inicio": "2024-01-01"
    },
    "dados_recebimento": {
        "dataHora": "2024-03-01T15:16:02.866Z",
        "idLote": "7ad2b593-f83b-44fb-afe4-aa18afc41561",
        "usuario": {
            "id": "91472973-9cd6-412e-9310-0cd0a2cf26a6",
            "nome": "exampleadminuser",
            "email": "gleytonclima@gmail.com"
        }
    }
};
describe('handler', () => {
    it('should call inserirDocumento with the correct argument', async () => {
        
        const event = {
            Records: [
                {
                    body: JSON.stringify(mensagemJson),
                },
            ],
        };
        const context = {};

        await handler(event, context);

        expect(inserirDocumento).toHaveBeenCalledWith({...mensagemJson, resumo: {
            "municipio_uf": "AM",
            "municipio_ibge": "1302603",
            "municipio_nome": "Manaus",
            "periodo_inicio": new Date("2024-01-01"),
            "periodo_fim": new Date("2024-01-30"),
            "iip_aegypti": 75,
            "ib_aegypti": 100,
            "iip_albopictus": 25,
            "ib_albopictus": 50,
            "data_recebimento": new Date("2024-03-01T15:16:02.866Z"),
            "aegypti_alto": 1,
            "aegypti_medio": 1,
            "aegypti_baixo": 2,
            "criadouros_aegypti_a1": 1,
            "criadouros_aegypti_a2": 20,
            "criadouros_aegypti_c": 5,
            "criadouros_aegypti_d1": 0,
            "criadouros_aegypti_d2": 0,
            "criadouros_aegypti_e": 1,
            "localizacao": {
                "type": "Point",
                "coordinates": [
                    -60.0212,
                    -3.11866
                ]
            }
        }});
    });

    it('should return a response object with the correct properties', async () => {
        const event = {
            Records: [
                {
                    body: JSON.stringify(mensagemJson),
                },
            ],
        };
        const context = {};

        const response = await handler(event, context);

        expect(response.statusCode).toBe(200);
        expect(response.isBase64Encoded).toBe(false);
        expect(response.headers).toEqual({'content-type': 'application/json'});
        expect(response.body).toEqual(
            JSON.stringify({
                message: 'Processador: Payload recebido com sucesso',
            }),
        );
    });
});
