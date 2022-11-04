import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
require('dotenv').config();
import { v4 as uuidv4 } from 'uuid';
import { ImageService } from './image.service';

const FirebaseStorage = require('multer-firebase-storage');
const Multer = require('multer');

const multer = Multer({
  storage: FirebaseStorage({
    bucketName: process.env.IMAGE_DB_URL,
    credentials: {
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      projectId: process.env.FIREBASE_PROJECT_ID,
    },
    hooks: {
      beforeUpload(req, file) {
        // console.log(`before upload:`, req, file);
      },
      afterUpload(req, file, fref, bref) {
        console.log(
          `image link: `,
          `https://firebasestorage.googleapis.com/v0/b/${fref.metadata.bucket}${fref.baseUrl}/${fref.metadata.name}?alt=media`,
        );
      },
      beforeRemove(req, file) {
        // console.log(`before remove:`, req, file);
        console.log('123');
      },
      afterRemove(req, file, fref, bref) {
        console.log('987');

        // console.log(`after remove:`, req, file, fref, bref);
      },
    },
  }),
});

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multer))
  handleUpload(@UploadedFile() file: Express.Multer.File): string {
    return `${file.originalname} was successfully added`;
  }

  @Delete('/:id')
  remove(@Param('id') id: string): void {
    console.log('remove');
  }
}
