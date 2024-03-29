import { Body, Controller, Get, Post, Query, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDTO } from 'src/DTO/create-user.dto';
import { AuthService } from './auth.service';
import { SendOtp } from 'src/DTO/send-otp.dto';
import { Response } from 'express';
import * as fs from 'node:fs'
import { FileInterceptor } from '@nestjs/platform-express';

export type SigninBody = {identity: string, password: string}

@Controller('auth')
export class AuthController {

    constructor(private readonly authService : AuthService){}

    @Post('/sendOtp')
    async sendOtp(@Body() {mail}: SendOtp){
        return await this.authService.sendOtp({mail})
    }

    @Post('/register')
    async register(@Body() req : CreateUserDTO){        
        return await this.authService.register(req)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/badge')
    getBadge(@Request() req, @Res() res: Response, @Query('id') idQuery: string){
        if (req.user) {
            const {id} = req.user;
            console.log({id, idQuery});
            
            if (id === idQuery) {
             
                res.download(`src/Badges/DontShare${id}.ds`)
                fs.rm(`src/Badges/DontShare${id}.ds`, (err) => {
                    if (err) console.log(err);
                    
                })
            }
        }
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
        uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
        return file;
    }

}