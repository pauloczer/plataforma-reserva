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

// Função para obter um serviço específico por ID

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verifica se o ID é um valor válido
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID do serviço é obrigatório e deve ser um número válido' });
    }

    // Busca o serviço pelo ID
    const service = await prisma.service.findUnique({
      where: { id: Number(id) }, // Converte o ID para número
    });

    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    res.status(200).json(service);
  } catch (error) {
    console.error('Detalhes do erro:', error);
    res.status(500).json({ error: 'Erro ao obter serviço' });
  }
};



// Função para editar um serviço existente
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Obtém o ID do serviço a ser editado dos parâmetros da requisição
    const { name, description, price } = req.body; // Dados para atualizar

    // Validações
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'O nome do serviço é obrigatório' });
    }
    
    if (!description || typeof description !== 'string' || description.trim() === '') {
      return res.status(400).json({ message: 'A descrição do serviço é obrigatória' });
    }
    
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: 'O preço do serviço deve ser um número positivo.' });
    }

    // Verifica se o ID está presente e se o serviço existe
    if (!id) {
      return res.status(400).json({ message: 'ID do serviço é obrigatório.' });
    }

    const service = await prisma.service.update({
      where: { id: Number(id) }, // Converte o ID para número e procura o serviço
      data: {
        name,
        description,
        price,
      },
    });

    res.status(200).json(service);
  } catch (error) {
    console.error('Detalhes do erro:', error);
    res.status(500).json({ error: 'Erro ao atualizar serviço' });
  }
};

// Função para remover um serviço existente
export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Obtém o ID do serviço a ser removido dos parâmetros da requisição

    // Verifica se o ID está presente
    if (!id) {
      return res.status(400).json({ message: 'ID do serviço é obrigatório.' });
    }

    // Remove o serviço do banco de dados
    await prisma.service.delete({
      where: { id: Number(id) }, // Converte o ID para número e procura o serviço
    });

    res.status(200).json({ message: 'Serviço removido com sucesso.' });
  } catch (error) {
    console.error('Detalhes do erro:', error);
    res.status(500).json({ error: 'Erro ao remover serviço' });
  }
};

