import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from '../client/client.schema';

export type ExisDocument = Exis & Document;

@Schema()
export class Exis {
  @Prop()
  text: string;

  @Prop()
  date: Date;

  @Prop({ type: Types.ObjectId, ref: Client.name })
  client: Client;
}

export const ExisSchema = SchemaFactory.createForClass(Exis);
