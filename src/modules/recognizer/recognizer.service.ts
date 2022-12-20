import { Injectable } from '@nestjs/common';
import { Prisma, Recognizer, User, Visit } from '@prisma/client';

import { SimilarService } from './../similar/similar.service';
import { ClientService } from './../client/client.service';
import { VisitService } from './../visits/visit.service';
import { PrismaService } from '../prisma/prisma.service';
import { BotUpdate } from '../bot/bot.update';
import { UsersService } from '../users/users.service';

type FaceType = {
  face_id: string;
  accuracy: number;
  frame_content: string;
};

type RecognizerRequestType = {
  device_id: string;
  device_ip: string;
  mode: string;
  faces?: FaceType[];
  error?: number;
  message: string;
};

@Injectable()
export class RecognizerService {
  constructor(
    private prisma: PrismaService,
    private visitService: VisitService,
    private clientService: ClientService,
    private similarService: SimilarService,
    private botUpdate: BotUpdate,
    private userService: UsersService,
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

  async check(checkClientDto: RecognizerRequestType): Promise<string> {
    if (checkClientDto.mode === 'face_event') {
      const threeHoursAgo = new Date(Number(new Date()) - 3 * 60 * 60 * 1000);
      const minuteAgo = new Date(Number(new Date()) - 60 * 1000);

      if (checkClientDto.faces.length) {
        const recognizer = await this.prisma.recognizer.findUnique({
          where: {
            device_id: checkClientDto.device_id,
          },
        });

        checkClientDto.faces.forEach(async (face) => {
          if (face.accuracy >= 85) {
            const candidate = await this.prisma.client.findFirst({
              where: {
                face_id: {
                  hasSome: face.face_id,
                },
              },
            });

            if (candidate) {
              console.log('candidate');
              if (candidate.status === 'wheel') {
                console.log('wheel status');
                return;
              }

              const candidateUpdateDto = { ...candidate };
              delete candidateUpdateDto.id;

              if (candidate.lastIdentified < minuteAgo) {
                console.log('update candidate last ident');

                await this.clientService.update(candidate.id, {
                  ...candidateUpdateDto,
                  lastIdentified: new Date(),
                });
              }

              const visits = await this.visitService.getVisitsByClientId(
                candidate.id,
              );

              let lastVisit: Visit;

              visits.forEach((visit) => {
                if (lastVisit) {
                  visit.date > lastVisit.date;
                }
                lastVisit = visit;
              });

              if (!lastVisit || lastVisit.date < threeHoursAgo) {
                console.log('update last visit');
                await this.clientService.update(candidate.id, {
                  lastIdentified: new Date(),
                  lastVisitDate: new Date(),
                });

                if (candidate.status !== 'ghost') {
                  const { chatId, isRus } = await this.userService.findById(
                    recognizer.userId,
                  );

                  const wasRecognizedNow: string = isRus
                    ? 'был опознан 👁️'
                    : 'was recognized now 👁️';

                  await this.botUpdate.sendMessage(
                    chatId,
                    `${candidate.name} ${wasRecognizedNow}`,
                  );
                }

                return this.visitService.create({}, candidate.id);
              } else {
                return;
              }
            } else {
              const clientsWithLastIdentified =
                await this.prisma.client.findMany({
                  where: {
                    lastIdentified: {
                      not: null,
                      isSet: true,
                    },
                  },
                  select: {
                    id: true,
                    name: true,
                    status: true,
                    phone: true,
                    averageBill: true,
                    billsAmount: true,
                    userId: true,
                    face_id: true,
                    lastIdentified: true,
                  },
                });

              if (clientsWithLastIdentified.length) {
                console.log(
                  'clientsWithLastIdentified: ',
                  clientsWithLastIdentified,
                );

                clientsWithLastIdentified.forEach(
                  async (clientWithLastIdentified) => {
                    const clientUpdateDto = { ...clientWithLastIdentified };
                    delete clientUpdateDto.id;

                    if (clientWithLastIdentified.lastIdentified) {
                      if (clientWithLastIdentified.lastIdentified > minuteAgo) {
                        const similars =
                          await this.similarService.getSimilarsByClientId(
                            clientWithLastIdentified.id,
                          );
                        const oldSimilar = similars.find(
                          (el) => el.face_id === face.face_id,
                        );
                        if (!oldSimilar && similars.length < 5) {
                          console.log('update similars');
                          const faceDto = {
                            ...face,
                            base64image: face.frame_content,
                          };
                          delete faceDto.frame_content;
                          delete faceDto.accuracy;

                          await this.similarService.create(
                            faceDto,
                            clientWithLastIdentified.id,
                          );
                        }
                      } else {
                        console.log('reset last Ident');

                        await this.clientService.update(
                          clientWithLastIdentified.id,
                          {
                            ...clientUpdateDto,
                            lastIdentified: null,
                          },
                        );
                      }
                    }
                  },
                );
              } else {
                console.log('new client: ', face.face_id);

                const newClient = await this.clientService.create(
                  {
                    face_id: [face.face_id],
                    lastIdentified: new Date(),
                    lastVisitDate: new Date(),
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
                  stream: undefined,
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
