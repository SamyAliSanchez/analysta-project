export class OpenPositionDto {
  assetId!: string
  side!: 'buy' | 'sell'
  quantity!: number
}
