import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ConditionalCheckFailedException,
  PutItemCommand,
  PutItemCommandInput,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/client-dynamodb';
import { awsClients } from 'src/libs/awsClient';
import { Msg } from 'src/models/res.model';
import { CreateTemplateDto } from './dto/template.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TemplateService {
  private readonly tableName = process.env.TEMPLATE_TABLE_NAME;
  private readonly ddbClient = new awsClients().ddbClient;

  async create(dto: CreateTemplateDto): Promise<Msg> {
    const templateId = uuidv4();

    const params: PutItemCommandInput = {
      TableName: this.tableName,
      Item: {
        templateId: { S: templateId },
        type: { S: 'template' },
        name: { S: dto.name },
        format: { S: dto.format },
      },
      ConditionExpression: 'attribute_not_exists(PK)',
    };

    try {
      await this.ddbClient.send(new PutItemCommand(params));

      return {
        message: 'template created successfully',
      };
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException) {
        throw new BadRequestException(
          'このテンプレートIDはすでに使用されています。',
        );
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async getAll() {
    const params: ScanCommandInput = {
      TableName: this.tableName,
    };

    try {
      const result = await this.ddbClient.send(new ScanCommand(params));

      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
