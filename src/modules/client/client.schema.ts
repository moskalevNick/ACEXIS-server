import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Image } from '../image/image.schema';
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

  @Prop({ type: [Types.ObjectId], ref: 'Image' })
  images: Image[];
}

export const ClientSchema = SchemaFactory.createForClass(Client);

// export const ClientSchema = new Schema({

//   name: String,
//   status: String,
//   coincidents: {type: [Client]},
//     pinnedExisId: Types.ObjectId,
//     bills: [Number],
//     phoneNumber: String,

//     @Prop({ type: Types.ObjectId, ref: User.name })
//     user: User;

//     @Prop({ type: [Types.ObjectId], ref: Image.name })
//     images: Image[];
// })
