import { Injectable } from '@nestjs/common';
import { RequestDTO } from './DTO/RequestDTO';
import { ResponseDTO } from './DTO/ResponseDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './models/Product';
import { DataDTO } from './DTO/DataDTO';
import * as crypto from 'crypto';
import { Transaction } from './models/Transaction';


@Injectable()
export class AppService {

    constructor(
        @InjectRepository(Product) private productsRepo: Repository<Product>,
        @InjectRepository(Transaction) private transactionRepo: Repository<Transaction>,
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
        let status = 9999

        try {
            status = await this.okCallbackGetHandler(data)
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
        console.log('status ' + status)

        return responseDTO
    }

    private async okCallbackGetHandler(data: any): Promise<number> {
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
            dataDTO = new DataDTO(obj.transaction_id, obj.uid, obj.sig, obj.transaction_time, obj.product_code, obj.call_id, obj.amount, obj.application_key)
        } catch (e) {
            throw "parsing data error"
        }

        // проверка подписи запроса
        if (dataDTO.sig != this.hashGenerator(this.getSigString(dataDTO))) return 104

        return await this.okCallbackGetLogic(dataDTO)
    }

    async okCallbackGetLogic(dataDTO: DataDTO): Promise<number> {
        console.log('sig valid')
        //сохранитьт информацию о транзакции

        //проверка подлинности товара
        if (!await this.isProductValid(dataDTO)) return 1001

        //если транзакции не существует
        if (!await this.isTransactionAvailabilityByTransactionId(dataDTO.transaction_id)) {
            //создать новую транзакцию
            await this.createTransaction(dataDTO.transaction_id, dataDTO.call_id, dataDTO.user_id, dataDTO.transaction_time, dataDTO.amount, dataDTO.product_code)
        }

        return 200
    }

    private async isProductValid(dataDTO: DataDTO) {
        const products = await this.findAllProducts()

        for (let l = 0; l < products.length; l++) {
            if (products[l].id.toString() == dataDTO.product_code && products[l].price == dataDTO.amount) {
                return true
            }
        }
        return false
    }

    private getSigString(dataDTO: object): string {
        const obj = JSON.parse(JSON.stringify(dataDTO))
        let keys = Object.keys(obj)
        keys = keys.sort((a, b) => a.localeCompare(b))

        let str = ''
        for (let l = 0; l < keys.length; l++) {
            if (keys[l] == 'sig' || keys[l] == 'session_key' || keys[l] == 'access_token') continue
            str = str + `${keys[l]}=${obj[keys[l]]}`
        }
        str = str + 'F67457E6A1D2E8AD8EF25527'

        return str
    }

    private hashGenerator(str: string): string {
        console.log(str)
        const hash = crypto.createHash('md5').update(str).digest('hex')
        console.log(hash)
        return hash
    }

    private async createTransaction(transactionId: string, callId: string, userId: string, transactionTimeOK: string, price: number, productId: string) {
        return await this.transactionRepo.save(
            this.transactionRepo.create(
                {
                    transactionId: transactionId,
                    callId: callId,
                    userId: userId,
                    transactionTimeOK: transactionTimeOK,
                    price: price,
                    productId: productId,
                    createDate: Date.now()
                }
            )
        )
    }

    private async isTransactionAvailabilityByTransactionId(transactionId: string): Promise<boolean> {
        const transaction = await this.transactionRepo.find({
            where: {
                transactionId: transactionId
            }
        }
        )

        if (transaction.length > 0) {
            return true
        }
        else {
            return false
        }
    }

}


