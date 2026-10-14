import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api');

	const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
	app.enableCors({
		origin: frontendUrl,
		credentials: true,
	});

	const port = process.env.PORT ?? 3001;

	app.useGlobalPipes(
		new ValidationPipe({
		whitelist: true,
		forbidNonWhitelisted: true,
		transform: true,
		}),
	
	);

	await app.listen(port);
}
bootstrap();
