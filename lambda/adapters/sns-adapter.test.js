const AWS = require('aws-sdk');
const {publishSnsMessage} = require('./sns-adapter');

describe('sns-adapter.js', () => {
    describe('publishSnsMessage', () => {
        const mockPayload = {message: 'Hello, world!'};
        const mockTopicArn = 'arn:aws:sns:us-east-1:123456789012:MyTopic';

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('should publish a message to SNS with the given payload and topicArn', async () => {
            const snsPublishMock = jest.fn((params) => {
                return {
                    promise: () => {
                        return Promise.resolve('Success');
                    },
                };
            });
            AWS.SNS = jest.fn().mockImplementation(() => ({publish: snsPublishMock}));

            await publishSnsMessage(mockPayload, mockTopicArn);

            expect(snsPublishMock).toHaveBeenCalledWith({
                Message: JSON.stringify(mockPayload),
                TopicArn: mockTopicArn,
            });
        });

        it('should throw an error if publish to SNS fails', async () => {
            const snsPublishMock = jest.fn((params) => {
                return {
                    promise: () => {
                        return Promise.reject(new Error('Failed to publish message to SNS'));
                    },
                };
            });
            AWS.SNS = jest.fn().mockImplementation(() => ({publish: snsPublishMock}));

            await expect(publishSnsMessage('error', mockTopicArn)).rejects.toThrow(
                new Error('Failed to publish message to SNS'),
            );
        });
    });
});
