import { Request, Response } from 'express';
import prisma from '../prismaClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('Tentativa de login:', { email, password });
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log('Utilizador não encontrado');
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Senha válida:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Senha inválida');
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET_KEY as string, { expiresIn: '48h' });
    console.log('Token gerado:', token);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Erro durante o login:', error);
    res.status(500).json({ error: 'Erro ao tentar fazer login' });
  }
};
