import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from '../client/client.schema';
import { Exis } from '../exis/exis.schema';

export type VisitDocument = Visit & Document;

@Schema()
export class Visit {
  @Prop({ type: Types.ObjectId, ref: Client.name })
  client: Client;

  @Prop()
  date: Date;

  @Prop({ type: Types.ObjectId, ref: Exis.name })
  exis?: Exis;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);
