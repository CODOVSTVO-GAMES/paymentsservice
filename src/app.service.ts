import { Injectable } from '@nestjs/common';
import { RequestDTO } from './DTO/RequestDTO';
import { ResponseDTO } from './DTO/ResponseDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './models/Product';
import { DataDTO } from './DTO/DataDTO';


@Injectable()
export class AppService {

    constructor(
        @InjectRepository(Product) private productsRepo: Repository<Product>
    ) { }


    async productsGetResponser(data: any) {
        const responseDTO = new ResponseDTO()
        let status = 200

        try {
            const productsArray = await this.productsGetHandler(data)
            responseDTO.data = productsArray
        }
        catch (e) {
            if (e == 'sessions not found' || e == 'session expired') {
                status = 403//перезапуск клиента
            }
            else if (e == 'server hash bad' || e == 'server DTO bad') {
                status = 401//активно сигнализировать в логи
            } else if (e == 'too many requests') {
                status = 429//повторить запрос позже
            } else if (e == 'parsing data error') {
                status = 400 //сервер не знает что делать
            } else {
                status = 400
            }
            console.log("Ошибка " + e)
        }
        responseDTO.status = status

        return responseDTO
    }

    private async productsGetHandler(data: any): Promise<Array<Product>> {
        let requestDTO;
        try {
            requestDTO = new RequestDTO(data.data, data.serverHash)
        } catch (e) {
            throw "server DTO bad"
        }

        if (this.isServerHashBad(requestDTO.serverHash)) {
            throw "server hash bad"
        }

        return await this.dataGetLogic()
    }

    async dataGetLogic(): Promise<Array<Product>> {
        return await this.findAllProducts();
    }

    //----------------------------------------------------------

    private async findAllProducts(): Promise<Product[]> {
        return await this.productsRepo.find()
    }

    private isServerHashBad(serverHash: string): boolean {
        if (serverHash == '89969458273-the-main-prize-in-the-show-psychics') {
            return false
        }
        return true
    }

    //---------------------------------------------------------

    async okCallbackGetResponser(data: any) {
        const responseDTO = new ResponseDTO()
        let status = 200

        try {
            const productsArray = await this.okCallbackGetHandler(data)
            responseDTO.data = productsArray
        }
        catch (e) {
            if (e == 'sessions not found' || e == 'session expired') {
                status = 403//перезапуск клиента
            }
            else if (e == 'server hash bad' || e == 'server DTO bad') {
                status = 401//активно сигнализировать в логи
            } else if (e == 'too many requests') {
                status = 429//повторить запрос позже
            } else if (e == 'parsing data error') {
                status = 400 //сервер не знает что делать
            } else {
                status = 400
            }
            console.log("Ошибка " + e)
        }
        responseDTO.status = status

        return responseDTO
    }

    private async okCallbackGetHandler(data: any): Promise<Array<Product>> {
        let requestDTO;
        try {
            requestDTO = new RequestDTO(data.data, data.serverHash)
        } catch (e) {
            throw "server DTO bad"
        }

        if (this.isServerHashBad(requestDTO.serverHash)) {
            throw "server hash bad"
        }

        let dataDTO
        try {
            const obj = JSON.parse(JSON.stringify(requestDTO.data))
            console.log(obj)
            dataDTO = new DataDTO(obj.transactionId, obj.userId, obj.sig, obj.transactionTime, obj.productCode, obj.callId, obj.amount, obj.applicationKey)
        } catch (e) {
            throw "parsing data error"
        }

        return await this.okCallbackGetLogic(dataDTO)
    }

    async okCallbackGetLogic(dataDTO: DataDTO): Promise<Array<Product>> {
        console.log(dataDTO)
        return await this.findAllProducts();
    }

}


