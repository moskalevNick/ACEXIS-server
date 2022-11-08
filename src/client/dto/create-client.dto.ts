export class CreateClientDto {
  readonly name: string;
  readonly status: string;
  readonly coincidentIds: string[];
  readonly id: string;
  readonly visits: { date: Date; exisId?: string }[];
  readonly pinnedExisId: string;
  readonly bills: number[];
  readonly imgIds: string[];
}
