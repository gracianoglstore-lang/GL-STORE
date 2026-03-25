import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'Pagamentos' | 'Conta e Login' | 'Jogos' | 'Outros';
  message: string;
  status: 'pending' | 'in-analysis' | 'resolved' | 'reopened';
  createdAt: string;
  updatedAt: string;
  responses: {
    id: string;
    sender: 'admin' | 'user';
    message: string;
    timestamp: string;
    attachments?: string[];
  }[];
  attachments?: string[];
}

interface SupportState {
  tickets: SupportTicket[];
  addTicket: (ticket: Omit<SupportTicket, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'responses'>) => void;
  updateTicketStatus: (id: string, status: SupportTicket['status']) => void;
  addResponse: (ticketId: string, response: Omit<SupportTicket['responses'][0], 'id' | 'timestamp'>) => void;
  deleteTicket: (id: string) => void;
}

export const useSupportStore = create<SupportState>()(
  persist(
    (set) => ({
      tickets: [],
      addTicket: (ticketData) => set((state) => ({
        tickets: [
          {
            ...ticketData,
            id: Math.random().toString(36).substring(2, 9),
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            responses: [],
          },
          ...state.tickets,
        ],
      })),
      updateTicketStatus: (id, status) => set((state) => ({
        tickets: state.tickets.map((t) =>
          t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
        ),
      })),
      addResponse: (ticketId, responseData) => set((state) => ({
        tickets: state.tickets.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                updatedAt: new Date().toISOString(),
                responses: [
                  ...t.responses,
                  {
                    ...responseData,
                    id: Math.random().toString(36).substring(2, 9),
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : t
        ),
      })),
      deleteTicket: (id) => set((state) => ({
        tickets: state.tickets.filter((t) => t.id !== id),
      })),
    }),
    {
      name: 'site-support-storage',
    }
  )
);
