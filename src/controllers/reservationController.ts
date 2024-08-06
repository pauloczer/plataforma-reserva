import { Request, Response } from 'express';
import prisma from '../prismaClient';

export const createReservation = async (req: Request, res: Response) => {
  try {
    const { serviceId, date } = req.body;
    const userId = (req as any).user.userId;

    if (!serviceId || !date) {
      return res.status(400).json({ message: 'O ID do serviço e a data são obrigatórios' });
    }

    // Certifique-se de converter `serviceId` e `userId` para números inteiros
    const serviceIdInt = parseInt(serviceId, 10);
    const userIdInt = parseInt(userId, 10);

    const user = await prisma.user.findUnique({ where: { id: userIdInt } });
    const service = await prisma.service.findUnique({ where: { id: serviceIdInt } });

    if (!user || !service) {
      return res.status(404).json({ message: 'Utilizador ou serviço não encontrado' });
    }

    if (user.balance < service.price) {
      return res.status(400).json({ message: 'Saldo insuficiente' });
    }

    // Usando transações para garantir a atomicidade
    const result = await prisma.$transaction(async (prisma) => {
      const reservation = await prisma.reservation.create({
        data: {
          userId: userIdInt,
          serviceId: serviceIdInt,
          date: new Date(date),  // Garantir que a data está no formato Date
        },
      });

      await prisma.user.update({
        where: { id: userIdInt },
        data: { balance: user.balance - service.price },
      });

      await prisma.user.update({
        where: { id: service.providerId },
        data: { balance: { increment: service.price } },
      });

      return reservation;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Detalhes do erro:', error);
    res.status(500).json({ error: 'Erro ao criar reserva' });
  }
};


export const getReservations = async (req: Request, res: Response) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        service: {
          include: {
            provider: { // Inclui o usuário provedor do serviço
              select: {
                id: true,
                name: true, // Inclui o campo 'name' do provedor
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Erro ao obter reservas' });
  }
};

export const getReservationCount = async (req: Request, res: Response) => {
  try {
    const count = await prisma.reservation.count();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Erro ao obter contagem de reservas:', error);
    res.status(500).json({ error: 'Erro ao obter contagem de reservas' });
  }
};