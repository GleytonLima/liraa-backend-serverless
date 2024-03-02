'use strict';
const {MongoClient, ObjectId} = require('mongodb');

function buildMongodbClient() {
    let uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/?retryWrites=true&w=majority`;
    if (!process.env.MONGODB_USERNAME) {
        uri = 'mongodb://host.docker.internal:27017';
    }
    const client = new MongoClient(uri, {
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
    });
    return client;
}

async function inserirDocumento(documento) {
    // eslint-disable-next-line max-len
    let uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/?retryWrites=true&w=majority`;
    if (!process.env.MONGODB_USERNAME) {
        uri = 'mongodb://host.docker.internal:27017';
    }
    const client = new MongoClient(uri, {
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
    });

    try {
        await client.connect();

        const database = client.db('liraa');
        const collection = database.collection('levantamentos');

        const result = await collection.insertOne(documento);

        console.log(`${JSON.stringify(result)} documento inserido`);
    } catch (err) {
        console.error(`Erro ao inserir documento no banco de dados: ${err}`);
        throw err;
    } finally {
        await client.close();
    }
}

async function listarLevantamentos(filter, options) {
    // eslint-disable-next-line max-len
    const client = buildMongodbClient();

    try {
        await client.connect();

        const database = client.db('liraa');
        const collection = database.collection('levantamentos');

        const skip = options.offset * options.limit;

        const optionsWithSkip = {
            limit: options.limit,
            skip,
        };

        const query = await collection.find(filter, optionsWithSkip);

        const total = await collection.countDocuments(filter, {});


        console.log(`Documentos recuperados`);
        return {
            total,
            data: await query.toArray(),
        };
    } catch (err) {
        console.error(`Erro ao listar documento no banco de dados: ${err}`);
        throw err;
    } finally {
        await client.close();
    }
}

async function deletarLevantamento(id) {
    // eslint-disable-next-line max-len
    const client = buildMongodbClient();

    try {
        await client.connect();

        const database = client.db('liraa');
        const collection = database.collection('levantamentos');

        await collection.deleteOne({_id: new ObjectId(id)});
    } catch (err) {
        console.error(`Erro ao deletar documento no banco de dados: ${err}`);
        throw err;
    } finally {
        await client.close();
    }
}


module.exports = {inserirDocumento, listarLevantamentos, deletarLevantamento};


