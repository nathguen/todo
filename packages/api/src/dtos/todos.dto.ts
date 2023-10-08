import { IsNumber, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  public title: string;

  @IsString()
  public description: string;

  @IsString()
  public status: string;

  @IsNumber()
  public ownerId: number;

  @IsNumber()
  public parentId?: number;
}

export class UpdateTodoDto extends CreateTodoDto {}
