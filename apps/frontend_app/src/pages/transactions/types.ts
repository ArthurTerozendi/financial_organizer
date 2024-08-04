export interface Transaction {
  id: string,
  description: string,
  value: number,
  type: 'Credit' | 'Debit',
  transactionDate: string,
  fitId: string,
  createdAt: Date,
  userId: string,
  tag?: {
    id: string,
    name: string,
    color: string,
    createdAt: Date,
  },
  bankStatement?: {
      id: string,
      name: string,
      createdAt: Date,
      userId: string
  }
}