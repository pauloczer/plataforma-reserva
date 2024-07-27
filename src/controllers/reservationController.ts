import { Request, Response } from 'express';
import prisma from '../prismaClient';

export const createReservation = async (req: Request, res: Response) => {
  try {
    const { serviceId, date } = req.body;
    const userId = (req as any).user.userId;

    if (!serviceId || !date) {
      return res.status(400).json({ message: 'O ID do serviço e a data são obrigatórios' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const service = await prisma.service.findUnique({ where: { id: serviceId } });

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
          userId,
          serviceId,
          date,
        },
      });

      await prisma.user.update({
        where: { id: userId },
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
        service: true,
        user: true,
      },
    });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter reservas' });
  }
};
