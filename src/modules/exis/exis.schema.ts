import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExisDocument = Exis & Document;

@Schema()
export class Exis {
  @Prop()
  text: string;

  @Prop()
  date: Date;

  @Prop()
  id: string;

  @Prop()
  clientId: string;
}

export const ExisSchema = SchemaFactory.createForClass(Exis);
