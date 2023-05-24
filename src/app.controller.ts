import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';
import { ResponseDTO } from './DTO/ResponseDTO';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @EventPattern('get_products')
    async getHello(data: any): Promise<ResponseDTO> {
        return await this.appService.productsGetResponser(data)
    }

    @EventPattern('ok_callback')
    async okCallback(data: any): Promise<ResponseDTO> {
        return await this.appService.okCallbackGetResponser(data)
    }
}
