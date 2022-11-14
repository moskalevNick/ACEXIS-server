import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Client } from '../client/client.schema';

export type AvatarDocument = Avatar & Document;

@Schema()
export class Avatar {
  @Prop()
  path: string;

  @Prop()
  publicUrl: string;

  @Prop({ type: Types.ObjectId, ref: Client.name })
  client: Client;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
