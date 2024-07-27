import { Request, Response } from 'express';
import prisma from '../prismaClient';

// Função para criar um novo serviço
export const createService = async (req: Request, res: Response) => {
  try {
    // Extraindo dados do corpo da requisição
    const { name, description, price } = req.body;
    const providerId = (req as any).user.userId;



    // Verificações de validação
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'O nome do serviço é obrigatório' });
    }
    
    if (!description || typeof description !== 'string' || description.trim() === '') {
      return res.status(400).json({ message: 'A descrição do serviço é obrigatória' });
    }
    
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: 'O preço do serviço deve ser um número positivo.' });
    }

    // Verifica se o providerId está presente (presumindo que está sendo passado no token JWT)
    if (!providerId) {
      return res.status(401).json({ message: 'Utilizador não autenticado.' });
    }

    // Criação do novo serviço no banco de dados
    const service = await prisma.service.create({
      data: {
        name,
        description,
        price,
        providerId,
      },
    });

    res.status(201).json(service);
  } catch (error) {
    console.error('Detalhes do erro:', error);
    res.status(500).json({ error: 'Erro ao criar serviço' });
  }
};

// Função para obter todos os serviços
export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter serviços' });
  }
};
