import config from './config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('api', {
  //   exclude: [{ path: '/:shortCode', method: RequestMethod.GET }],
  // });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  if (config.nodeEnv != 'production') {
    const config = new DocumentBuilder()
      .setTitle('URL Shortener - Indicina')
      .setDescription('Indicina URL Shortener API')
      .setVersion('1.0')
      .addTag('Indicina')
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, documentFactory);
  }

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  });
  await app.listen(config.port);
}
bootstrap()
  .then(() => {
    Logger.log(`
    ------------
    Server Application Started!
    API V1: http://localhost:${config.port}
    API Docs: http://localhost:${config.port}/docs
    Microserservice Started Successfully
    ------------
`);
  })
  .catch((error) => {
    Logger.error(`Failed to start the application:= , ${error}`);
  });
