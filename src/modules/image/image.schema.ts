import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Client } from '../client/client.schema';

export type ImageDocument = Image & Document;

@Schema()
export class Image {
  @Prop()
  path: string;

  @Prop()
  publicUrl: string;

  @Prop({ type: Types.ObjectId, ref: Client.name })
  client: Client;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
