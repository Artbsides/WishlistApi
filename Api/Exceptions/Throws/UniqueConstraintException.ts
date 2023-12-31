import { HttpException, HttpStatus } from "@nestjs/common";

export class UniqueConstraintException extends HttpException {
  error: string;
  message = "Conflit";

  constructor(partial: Partial<UniqueConstraintException>) {
    super({ message: [partial.error] }, HttpStatus.CONFLICT);

    Object.assign(this, partial);
  }
}
