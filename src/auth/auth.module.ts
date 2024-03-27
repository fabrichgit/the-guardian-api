import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-strategy';
import { MailService } from 'src/mailer.service';
import { AuthService } from './auth.service';
import { OtpSerive } from 'src/otp.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: '300s'}
    })
  ],
  providers: [AuthService, PrismaService, JwtStrategy, MailService, OtpSerive],
  controllers: [AuthController]
})
export class AuthModule {}