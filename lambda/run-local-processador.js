const {handler} = require('./processador.js');


run = async () => {
    const awsSQSMessageExample = {
        Records: [
            {
                body: JSON.stringify({
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
                        "dataHora": "2024-03-01T11:52:09.611Z",
                        "idLote": "c145493f-172b-442f-b482-7db6c543c4df",
                        "usuario": {
                            "id": "91472973-9cd6-412e-9310-0cd0a2cf26a6",
                            "nome": "exampleadminuser",
                            "email": "gleytonclima@gmail.com"
                        }
                    }
                }),
            },
        ],
    };

    const response = await handler(awsSQSMessageExample);

    console.log(response);
};

run();
