import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../users/user.schema';

export type ClientDocument = Client & Document;

@Schema()
export class Client {
  @Prop()
  name: string;

  @Prop()
  status: string;

  @Prop({ type: [Types.ObjectId], ref: Client.name })
  coincidents: Client[];

  @Prop()
  pinnedExisId: Types.ObjectId;

  @Prop()
  bills: number[];

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: User;

  @Prop()
  phoneNumber: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
