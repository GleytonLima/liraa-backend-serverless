const {MongoClient} = require('mongodb');
const {inserirDocumento} = require('./database-adapter');

jest.mock('mongodb');

describe('inserirDocumento', () => {
    beforeEach(() => {
        MongoClient.mockClear();
    });

    it('should insert a document into the database when environment variables are set', async () => {
        process.env.MONGODB_USERNAME = 'username';
        process.env.MONGODB_PASSWORD = 'password';
        process.env.MONGODB_CLUSTER = 'cluster';

        const client = {
            connect: jest.fn(),
            db: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue({
                    insertOne: jest.fn().mockResolvedValueOnce({
                        acknowledged: true,
                    }),
                }),
            }),
            close: jest.fn(),
        };
        MongoClient.mockImplementationOnce(() => client);

        const documento = {foo: 'bar'};
        await inserirDocumento(documento);

        expect(client.connect).toHaveBeenCalledTimes(1);
        expect(client.db).toHaveBeenCalledWith('liraa');
        expect(client.db().collection).toHaveBeenCalledWith('levantamentos');
        expect(client.db().collection().insertOne).toHaveBeenCalledWith(documento);
        expect(client.close).toHaveBeenCalledTimes(1);
    });

    it('should insert a document into the database when environment variables are not set', async () => {
        process.env.MONGODB_USERNAME = '';
        process.env.MONGODB_PASSWORD = '';
        process.env.MONGODB_CLUSTER = '';

        const client = {
            connect: jest.fn(),
            db: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue({
                    insertOne: jest.fn().mockResolvedValueOnce({
                        acknowledged: true,
                    }),
                }),
            }),
            close: jest.fn(),
        };
        MongoClient.mockImplementationOnce(() => client);

        const documento = {foo: 'bar'};
        await inserirDocumento(documento);

        expect(client.connect).toHaveBeenCalledTimes(1);
        expect(client.db).toHaveBeenCalledWith('liraa');
        expect(client.db().collection).toHaveBeenCalledWith('levantamentos');
        expect(client.db().collection().insertOne).toHaveBeenCalledWith(documento);
        expect(client.close).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when inserting a document into the database', async () => {
        process.env.MONGODB_USERNAME = 'username';
        process.env.MONGODB_PASSWORD = 'password';
        process.env.MONGODB_CLUSTER = 'cluster';

        const errorMessage = 'Database connection error';
        const client = {
            connect: jest.fn(),
            db: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue({
                    insertOne: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
                }),
            }),
            close: jest.fn(),
        };
        MongoClient.mockImplementationOnce(() => client);

        const documento = {foo: 'bar'};
        await expect(inserirDocumento(documento)).rejects.toThrowError(errorMessage);

        expect(client.connect).toHaveBeenCalledTimes(1);
        expect(client.db).toHaveBeenCalledWith('liraa');
        expect(client.db().collection).toHaveBeenCalledWith('levantamentos');
        expect(client.db().collection().insertOne).toHaveBeenCalledWith(documento);
        expect(client.close).toHaveBeenCalledTimes(1);
    });
});
