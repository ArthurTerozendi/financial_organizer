export interface TransactionForm {
  description: string;
  tag: string;
  value: number;
  type: 'Credit' | 'Debit';
  date: string;
}