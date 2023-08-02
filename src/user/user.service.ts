import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import {
  ConditionalCheckFailedException,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import { awsClients } from 'src/libs/awsClient';
import { Msg } from 'src/models/res.model';
import { UserFormatter } from './formatter/user.formatter';

@Injectable()
export class UserService {
  private readonly tableName = process.env.USER_TABLE_NAME;
  private readonly ddbClient = new awsClients().ddbClient;

  async create(dto: CreateUserDto): Promise<Msg> {
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const params: PutItemCommandInput = {
      TableName: this.tableName,
      Item: {
        userId: { S: dto.userId },
        name: { S: dto.name },
        hashedPassword: { S: hashedPassword },
        admin: { BOOL: dto.isAdmin },
      },
      ConditionExpression: 'attribute_not_exists(PK)',
    };

    try {
      await this.ddbClient.send(new PutItemCommand(params));

      return {
        message: 'User created successfully',
      };
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException) {
        throw new BadRequestException(
          'このユーザーIDはすでに使用されています。',
        );
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async getById(userId: string): Promise<any> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId',
      },
      ExpressionAttributeValues: {
        ':userId': { S: userId },
      },
    };

    try {
      const result = await this.ddbClient.send(new QueryCommand(params));
      const user = UserFormatter(result.Items[0]);

      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
