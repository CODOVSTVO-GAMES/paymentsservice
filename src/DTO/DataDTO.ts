export class DataDTO {
    transactionId: string
    userId: string
    sig: string
    transactionTime: string
    productCode: string
    callId: number
    amount: number
    applicationKey: string


    constructor(transactionId: string, userId: string, sig: string, transactionTime: string, productCode: string, callId: number, amount: number, applicationKey: string) {
        this.transactionId = transactionId
        this.userId = userId
        this.sig = sig
        this.transactionTime = transactionTime
        this.productCode = productCode
        this.callId = callId
        this.amount = amount
        this.applicationKey
    }
}
