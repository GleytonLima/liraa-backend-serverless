'use strict';

const {inserirDocumento} = require('./adapters/database-adapter');

function prepararResumo(documento) {
    const dashboard = {
        municipio_uf: documento.registro.municipio_uf,
        municipio_ibge: documento.registro.municipio_ibge,
        municipio_nome: documento.registro.municipio_nome,
        periodo_inicio: new Date(documento.registro.periodo_inicio),
        periodo_fim: new Date(documento.registro.periodo_fim),
        iip_aegypti: documento.registro.iip_aegypti,
        ib_aegypti: documento.registro.ib_aegypti,
        iip_albopictus: documento.registro.iip_albopictus,
        ib_albopictus: documento.registro.ib_albopictus,
        data_recebimento: new Date(documento.dados_recebimento.dataHora),
    };

    const classificacoes = documento.registro.dados.classificacoes_estrato_iip_aegypti;

    classificacoes.forEach((classificacao) => {
        const classificacaoNome = classificacao.risco?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        console.log("criadouroNome", classificacaoNome);
        dashboard[`aegypti_${classificacaoNome}`] = classificacao.quantidade;
    });

    const criadouros = documento.registro.dados.criadouros_aegypti;

    criadouros.forEach((criadouro) => {
        const criadouroNome = criadouro.criadouro.sigla.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        console.log("criadouroNome", criadouroNome);
        dashboard[`criadouros_aegypti_${criadouroNome}`] = criadouro.quantidade;
    });

    //vamos adicionar as coordenadas do municipio no documento que estamos inserindo a partir do arquivo de coordenadas. vamos ainda usar o tipo GeoJSON Object
    const coordenadas = require('./municipios-coordenadas.json');
    const municipio = coordenadas.find((municipio) => parseInt(municipio.i) === parseInt(documento.registro.municipio_ibge));
    if (municipio) {        
        dashboard.localizacao = {
            type: 'Point',
            coordinates: [municipio.lon, municipio.lat],
        };
    }

    return dashboard;
}

module.exports.handler = async (event, context) => {
    console.log('Processador: evento recebido: ', event);

    const {Records} = event;
    const {body} = Records[0];
    const mensagemJson = JSON.parse(body);

    const resumo = prepararResumo(mensagemJson);

    await inserirDocumento({...mensagemJson, resumo});

    return {
        statusCode: 200,
        isBase64Encoded: false,
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            message: `Processador: Payload recebido com sucesso`,
        }),
    };
};
