import { IsUUID } from 'class-validator';

export class RefOneParams {
  @IsUUID('all', {
    message: 'O id deve ser um UUID válido',
  })
  id: string;
}
