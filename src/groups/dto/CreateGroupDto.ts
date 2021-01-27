import { NoisesDto } from './noisesDto';

export class CreateGroupDto {
  userId: number;
  groupName: string;
  weather: string;
  noises: NoisesDto[];
  music: object;
}