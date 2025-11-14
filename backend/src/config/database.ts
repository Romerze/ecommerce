import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.DB_PATH || './database.sqlite';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite conectado correctamente');

    // Sincronizar modelos con la base de datos
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Modelos sincronizados con la base de datos');
  } catch (error) {
    console.error('❌ Error al conectar a SQLite:', error);
    process.exit(1);
  }
};

export default sequelize;
