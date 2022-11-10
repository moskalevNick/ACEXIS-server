import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClientDocument = Client & Document;

@Schema()
export class Client {
  @Prop()
  name: string;

  @Prop()
  status: string;

  @Prop()
  coincidentIds: [string];

  @Prop()
  id: string;

  @Prop()
  visits: [{ date: Date; exisId?: string }];

  @Prop()
  pinnedExisId: string;

  @Prop()
  bills: [number];

  @Prop()
  imgIds: [string];

  @Prop()
  exisIds: [string];

  @Prop()
  userId: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
