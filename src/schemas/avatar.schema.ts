import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AvatarDocument = Avatar & Document;

@Schema()
export class Avatar {
  @Prop()
  id: string;

  @Prop()
  path: string;

  @Prop()
  publicUrl: string;

  @Prop()
  clientId: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
