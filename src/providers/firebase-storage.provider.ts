import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { getStorage, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { Image } from 'src/modules/image/image.schema';
import { ImageService } from 'src/modules/image/image.service';

import path from 'path';

@Injectable()
export class FirebaseStorageProvider {
  constructor(private imageService: ImageService) {}

  public async upload(
    file: Express.Multer.File,
    folder: string,
    clientId: string,
  ): Promise<{ fullName: string; name: string }> {
    const storage = getStorage();

    const fileName = `${path.parse(file.originalname).name}__${uuidv4()}`;
    const fileExtension = path.parse(file.originalname).ext;
    const fullName = `${folder}/${fileName}${fileExtension}`;

    const fileRef = ref(storage, fullName);

    const uploaded = await uploadBytes(fileRef, file.buffer, {
      contentType: 'image/jpeg',
    });

    return { fullName, name: uploaded.metadata.name };
  }

  public async delete(image: Image): Promise<string> {
    const storage = getStorage();
    const fileRef = ref(storage, image.path);
    try {
      await deleteObject(fileRef);
    } catch (e) {
      return `can't remove this image`;
    }

    return `image successfully deleted`;
  }
}
