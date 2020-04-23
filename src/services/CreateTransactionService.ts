import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface RequestDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
}

const ALLOWED_TYPES = ['income', 'outcome'];

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, type, value }: RequestDTO): Transaction {
    if (!ALLOWED_TYPES.includes(type)) {
      throw Error('Invalid transaction type.');
    }

    if (Number.isNaN(value) || value < 0) {
      throw Error('Invalid transaction value.');
    }

    const { total: availableAmount } = this.transactionsRepository.getBalance();
    if (value > availableAmount && type === 'outcome') {
      throw Error('Insufficient account balance.');
    }

    const transaction = this.transactionsRepository.create({
      title,
      type,
      value,
    });
    return transaction;
  }
}

export default CreateTransactionService;
