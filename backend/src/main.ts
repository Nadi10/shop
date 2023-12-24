// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:3000'];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    if (req.method === 'OPTIONS') {
      res.status(204).send();
    } else {
      next();
    }
  });
  app.enableCors({
    origin: 'http://localhost:3000', // разрешить запросы только с этого origin
    credentials: true, // разрешить передачу учетных данных (как куки)
  });

  app.setGlobalPrefix('api');
  // app.use(cookieParser());

  await app.listen(4200);
}

bootstrap();
