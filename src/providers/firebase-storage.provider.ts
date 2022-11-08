import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { getStorage, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { AvatarService } from 'src/avatar/avatar.service';
const path = require('path');

@Injectable()
export class FirebaseStorageProvider {
  constructor(private avatarService: AvatarService) {}
  public async upload(
    file: Express.Multer.File,
    folder: string,
    clientId: string,
  ): Promise<string> {
    const storage = getStorage();

    const fileName = path.parse(file.originalname).name;
    const fileExtension = path.parse(file.originalname).ext;

    const fileRef = ref(
      storage,
      `${folder}/${fileName}__${uuidv4()}${fileExtension}`,
    );

    const uploaded = await uploadBytes(fileRef, file.buffer, {
      contentType: 'image/jpeg',
    });

    const avatarId = uuidv4();

    this.avatarService.create({
      id: avatarId,
      path: `${folder}/${fileName}__${uuidv4()}${fileExtension}`,
      clientId: clientId,
      publicUrl: `https://firebasestorage.googleapis.com/v0/b/acexis-c375d.appspot.com/o/client-avatars%2F${uploaded.metadata.name}?alt=media`,
    });

    return avatarId;
  }

  public async delete(): Promise<string> {
    const storage = getStorage();

    const fileRef = ref(
      storage,
      `client-avatars/beauti.full__cd02391e-2e84-4c85-94b6-4f78463b9f22.jpeg`,
    );

    const deleted = await deleteObject(fileRef);

    console.log('deleted', deleted);

    return '123';
  }
}
