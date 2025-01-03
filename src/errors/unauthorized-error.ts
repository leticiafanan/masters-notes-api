import { AppError } from './app-errors';

export class UnauthorizedError extends AppError {
  constructor(message?: string) {
    super(message || 'Unauthorized Error.', 400);
  }
}