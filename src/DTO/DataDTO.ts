export class DataDTO {
    transaction_id: string
    userId: string
    sig: string
    transaction_time: string
    product_code: string
    call_id: string
    amount: number
    application_key: string

    constructor(transaction_id: string, userId: string, sig: string, transaction_time: string, product_code: string, call_id: string, amount: number, application_key: string) {
        this.transaction_id = transaction_id
        this.userId = userId
        this.sig = sig
        this.transaction_time = transaction_time
        this.product_code = product_code
        this.call_id = call_id
        this.amount = amount
        this.application_key = application_key
    }
}
