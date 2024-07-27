import { Request, Response } from 'express';
import prisma from '../prismaClient';
import bcrypt from 'bcryptjs';

// Função para registrar um novo usuário
export const register = async (req: Request, res: Response) => {
  try {
    // Extraindo dados do corpo da requisição
    const { name, nif, email, password, role, balance } = req.body;

    // Validações de entrada
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'Nome é obrigatório' });
    }
    if (!nif || typeof nif !== 'string' || nif.trim() === '') {
      return res.status(400).json({ message: 'NIF é obrigatório' });
    }
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return res.status(400).json({ message: 'Email é obrigatório' });
    }
    if (!password || typeof password !== 'string' || password.trim() === '') {
      return res.status(400).json({ message: 'Senha é obrigatória' });
    }
    if (!role || typeof role !== 'string' || role.trim() === '') {
      return res.status(400).json({ message: 'Tipo do Utilizador é obrigatório' });
    }
    if (balance === undefined || typeof balance !== 'number' || balance < 0) {
      return res.status(400).json({ message: 'Saldo é obrigatório e deve ser um número positivo' });
    }

    // Criptografa a senha antes de salvar no banco de dados
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criação do usuário no banco de dados
    const user = await prisma.user.create({
      data: {
        name,
        nif,
        email,
        password: hashedPassword,
        role,
        balance,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Erro ao criar o utilizador:', error);
    res.status(500).json({ error: 'Erro ao criar o utilizador' });
  }
};
