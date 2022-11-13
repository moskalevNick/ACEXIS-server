import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Avatar } from '../avatar/avatar.schema';

export type ClientDocument = Client & Document;

@Schema()
export class Client {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  status: string;

  @Prop()
  coincidentIds: string[];

  @Prop()
  visits: { date: Date; exisId?: string }[];

  @Prop()
  pinnedExisId: string;

  @Prop()
  bills: number[];

  @Prop()
  imgIds: string[];

  @Prop({ type: [Types.ObjectId], ref: Avatar.name })
  images: Avatar[];

  @Prop()
  exisIds: string[];

  @Prop()
  userId: string;

  @Prop()
  phoneNumber: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
