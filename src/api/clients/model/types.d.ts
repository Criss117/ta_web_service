import { Client, Ticket } from '@prisma/client';

export type CLientAndTickets = Client & {
  tickets?: Ticket[];
};
