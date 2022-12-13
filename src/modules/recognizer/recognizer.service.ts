import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { Prisma, Recognizer, User, Visit } from '@prisma/client';

import { ClientService } from './../client/client.service';
import { VisitService } from './../visits/visit.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecognizerService {
  constructor(
    private prisma: PrismaService,
    private visitService: VisitService,
    private clientService: ClientService,
  ) {}

  async create(
    createRecognizerDto: Pick<
      Prisma.RecognizerCreateInput,
      'device_id' | 'device_ip'
    >,
    userId: User['id'],
  ): Promise<Recognizer> {
    const data: Prisma.RecognizerUncheckedCreateInput = {
      ...createRecognizerDto,
      userId,
    };

    const newRecognizer = await this.prisma.recognizer.create({
      data,
      select: {
        id: true,
        device_id: true,
        device_ip: true,
        userId: true,
      },
    });

    return newRecognizer;
  }

  async check(checkClientDto: any): Promise<any> {
    if (checkClientDto.mode === 'face_event') {
      const recognizer = await this.prisma.recognizer.findUnique({
        where: {
          device_id: checkClientDto.device_id,
        },
      });

      if (checkClientDto.faces.length) {
        await checkClientDto.faces.forEach(async (face: any) => {
          if (face.accuracy >= 85) {
            const candidate = await this.prisma.client.findFirst({
              where: {
                face_id: {
                  hasSome: face.face_id,
                },
              },
            });

            if (candidate) {
              console.log('candidate: ', candidate.face_id);
              if (candidate.status === 'wheel') {
                console.log('wheel status');
                return;
              }

              await this.clientService.update(candidate.id, {
                ...candidate,
                lastIdentified: new Date(),
              });

              const visits = await this.visitService.getVisitsByClientId(
                candidate.id,
              );
              const threeHoursAgo = new Date(
                new Date().setHours(new Date().getHours() - 3),
              );

              let lastVisit: Visit;

              visits.forEach((visit) => {
                if (lastVisit) {
                  visit.date > lastVisit.date;
                }
                lastVisit = visit;
              });

              if (!lastVisit || lastVisit.date < threeHoursAgo) {
                await this.visitService.create({}, candidate.id);
              } else {
                return;
              }
            } else {
              const minuteAgo = new Date(
                new Date().setHours(new Date().getMinutes() - 1),
              );

              const clientWithLastIdentified =
                await this.prisma.client.findFirst({
                  where: {
                    lastIdentified: {
                      isSet: true,
                    },
                  },
                });

              if (clientWithLastIdentified) {
                console.log(
                  'clientWithLastIdentified: ',
                  clientWithLastIdentified.face_id,
                );

                const clientUpdateDto = clientWithLastIdentified;
                delete clientUpdateDto.id;

                if (clientWithLastIdentified.lastIdentified) {
                  if (clientWithLastIdentified.lastIdentified > minuteAgo) {
                    console.log('update similars!!!!!!!!!!!!');

                    // await this.clientService.update(similarClient.id, {
                    //   ...similarClient,
                    // });
                  } else {
                    console.log('lastIdentified undefined??????????????');
                    await this.clientService.update(
                      clientWithLastIdentified.id,
                      {
                        ...clientUpdateDto,
                        lastIdentified: undefined,
                      },
                    );
                  }
                } else {
                  console.log('update lastIdentified!!!!!!!!!!!!');
                  await this.clientService.update(clientWithLastIdentified.id, {
                    ...clientUpdateDto,
                    lastIdentified: new Date(),
                  });
                }
              } else {
                const newClient = await this.clientService.create(
                  {
                    face_id: [face.face_id],
                  },
                  recognizer.userId,
                );

                const clientImage: Express.Multer.File = {
                  fieldname: '',
                  originalname: `recognizer_image___`,
                  encoding: '',
                  mimetype: '',
                  size: face.frame_content.length,
                  destination: '',
                  filename: '',
                  path: '',
                  buffer: Buffer.from(face.frame_content, 'base64'),
                  stream: face.frame_content,
                };

                await this.clientService.uploadImage(newClient.id, clientImage);
                await this.visitService.create({}, newClient.id);
              }
            }
          } else return;
        });
      } else {
        return 'faces not found';
      }
    }
    if (checkClientDto.mode === 'status') {
      if (checkClientDto.error !== 0) {
        console.log(
          `there was an error with message: ${checkClientDto.message}. Error code: ${checkClientDto.error}`,
        );
        return `there was an error with message: ${checkClientDto.message}. Error code: ${checkClientDto.error}`;
      }
    }
  }
}
