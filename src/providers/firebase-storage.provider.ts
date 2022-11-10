import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { getStorage, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { Avatar } from 'src/modules/avatar/avatar.schema';
import { AvatarService } from 'src/modules/avatar/avatar.service';
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

    const fileName = `${path.parse(file.originalname).name}__${uuidv4()}`;
    const fileExtension = path.parse(file.originalname).ext;
    const fullName = `${folder}/${fileName}${fileExtension}`;

    const fileRef = ref(storage, fullName);

    const uploaded = await uploadBytes(fileRef, file.buffer, {
      contentType: 'image/jpeg',
    });

    const avatarId = uuidv4();

    this.avatarService.create({
      id: avatarId,
      path: fullName,
      clientId: clientId,
      publicUrl: `https://firebasestorage.googleapis.com/v0/b/acexis-c375d.appspot.com/o/client-avatars%2F${uploaded.metadata.name}?alt=media`,
    });

    return avatarId;
  }

  public async delete(avatar: Avatar): Promise<string> {
    const storage = getStorage();
    const fileRef = ref(storage, avatar.path);
    try {
      await deleteObject(fileRef);
    } catch (e) {
      return `can't remove this avatar`;
    }

    return `avatar successfully deleted`;
  }
}
