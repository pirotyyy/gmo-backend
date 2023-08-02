import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { awsClients } from 'src/libs/awsClient';
import { CreateProjectDto } from './dto/project.dto';
import {
  ConditionalCheckFailedException,
  PutItemCommand,
  PutItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProjectService {
  private readonly tableName = process.env.PROJECT_TABLE_NAME;
  private readonly ddbClient = new awsClients().ddbClient;

  async createProject(dto: CreateProjectDto): Promise<void> {
    const projectId = uuidv4();

    const params: PutItemCommandInput = {
      TableName: this.tableName,
      Item: {
        projectId: { S: projectId },
        userId: { S: dto.userId },
        name: { S: dto.name },
        templateId: { S: dto.templateId },
        text: { S: dto.text },
      },
      ConditionExpression: 'attribute_not_exists(PK)',
    };

    try {
      await this.ddbClient.send(new PutItemCommand(params));
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException) {
        throw new BadRequestException(
          'このプロジェクトIDはすでに使用されています。',
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
