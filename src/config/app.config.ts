import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 80,
  kafka: {
    host: process.env.KAFKA_HOST,
    port: process.env.KAFKA_PORT,
  },
}));
