import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export class awsClients {
  // ddbClient = new DynamoDBClient({
  //   region: 'localhost',
  //   endpoint: 'http://localhost:8082',
  // });

  ddbClient = new DynamoDBClient({
    region: 'ap-northeast-1',
  });
}
