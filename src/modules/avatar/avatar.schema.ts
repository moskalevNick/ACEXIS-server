import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AvatarDocument = Avatar & Document;

@Schema()
export class Avatar {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop()
  path: string;

  @Prop()
  publicUrl: string;

  @Prop()
  clientId: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
