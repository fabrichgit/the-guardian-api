import { generate } from "otp-generator";
import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotImplementedException } from "@nestjs/common";
import { MailService } from "./mailer.service";
import { PrismaService } from "./prisma.service";

@Injectable()
export class OtpSerive{
    constructor(private readonly mailer: MailService,
        private readonly prisma: PrismaService){}

    private generateOtp(){
        return generate(6, {upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false});
    }

    async sendOtp({mail}: {mail: string}){
        const otp = this.generateOtp();

        const existQueue = await this.prisma.queueOtp.findUnique({
            where: {mail}
        })

        if (existQueue) {
            throw new ConflictException()
        }

        try {
            await this.prisma.queueOtp.create({
                data: {otp, mail}
            })
            return await this.mailer.sendOtp({otp, mail});
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
        
    }

    // async verifyOtp({identity, otp}: VerifyOtpDto){
    //     try {
    //         const queueOtp = await this.prisma.queueOtp.findUnique({
    //             where: {identity, otp, type: "register"}
    //         })
    //         if (!queueOtp) {
    //             throw new ForbiddenException()
    //         }
            
    //         await this.prisma.queueOtp.delete({
    //             where: queueOtp
    //         })

    //         return {
    //             error: false,
    //             message: 'Verfication succesfully !'
    //         }            
    //     } catch (error) {
    //         throw new InternalServerErrorException(error)
    //     }
    // }
}