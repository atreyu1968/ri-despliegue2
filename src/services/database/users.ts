import { executeQuery, transaction } from '../../config/database';
import type { User } from '../../types/user';

export const userQueries = {
  // Consultas parametrizadas para prevenir SQL injection
  findByEmail: 'SELECT * FROM users WHERE email = ?',
  findById: 'SELECT * FROM users WHERE id = ?',
  create: `
    INSERT INTO users (
      name, lastName, medusaCode, email, phone, 
      center, network, role, imageUrl
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  update: `
    UPDATE users 
    SET name = ?, lastName = ?, medusaCode = ?, 
        email = ?, phone = ?, center = ?, 
        network = ?, role = ?, imageUrl = ?
    WHERE id = ?
  `,
  delete: 'DELETE FROM users WHERE id = ?'
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const users = await executeQuery<User[]>(userQueries.findByEmail, [email]);
  return users[0] || null;
};

export const findUserById = async (id: string): Promise<User | null> => {
  const users = await executeQuery<User[]>(userQueries.findById, [id]);
  return users[0] || null;
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  return transaction(async (conn) => {
    const result = await conn.query(userQueries.create, [
      user.name,
      user.lastName,
      user.medusaCode,
      user.email,
      user.phone,
      user.center,
      user.network,
      user.role,
      user.imageUrl
    ]);

    return {
      id: result.insertId,
      ...user
    };
  });
};

export const updateUser = async (id: string, user: Partial<User>): Promise<boolean> => {
  const result = await executeQuery(userQueries.update, [
    user.name,
    user.lastName,
    user.medusaCode,
    user.email,
    user.phone,
    user.center,
    user.network,
    user.role,
    user.imageUrl,
    id
  ]);
  
  return result.affectedRows > 0;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const result = await executeQuery(userQueries.delete, [id]);
  return result.affectedRows > 0;
};