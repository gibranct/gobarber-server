import { QueryInterface } from 'sequelize';
import bcrypt from 'bcryptjs';

export = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          id: 1,
          name: 'Chico Barbeiro',
          provider: true,
          email: 'chico@gmail.com',
          password_hash: bcrypt.hashSync('123456', 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete('users', { id: 1 }, {});
  },
};
