export class UpdateClientDto {
  readonly name: string;
  readonly status: string;
  readonly coincidentIds: string[];
  readonly visits: { date: Date; exisId?: string }[];
  readonly pinnedExisId: string;
  readonly bills: number[];
  readonly imgIds: string[];
  readonly userId: string;
  readonly exisIds: string[];
}
