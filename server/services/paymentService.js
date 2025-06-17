const { v4: uuidv4 } = require('uuid')
const { Order } = require('../models/')

class PaymentService {
    constructor() {
        this.paymentProviders = {
            credit_card: this.processCreditCardPayment,
            paypal: this.processPaypalPayment,
            crypto: this.processCryptoPayment,
        }
    }

    async processPayment(paymentMethod, paymentDetails) {
        const processor = this.paymentProviders[paymentMethod]
        if (!processor) {
            throw new Error('Unsupported payment method')
        }

        return processor(paymentDetails)
    }

    async processCreditCardPayment(details) {
        // Mock credit card processing
        return {
            success: Math.random() > 0.1, // 90% success rate
            transactionId: uuidv4(),
            amount: details.amount,
            currency: details.currency,
            processedAt: new Date(),
        }
    }

    async processPaypalPayment(details) {
        // Mock PayPal processing
        return {
            success: Math.random() > 0.15, // 85% success rate
            transactionId: `PAYPAL-${uuidv4()}`,
            amount: details.amount,
            currency: details.currency,
            processedAt: new Date(),
        }
    }

    async processCryptoPayment(details) {
        // Mock crypto processing
        return {
            success: Math.random() > 0.2, // 80% success rate
            transactionId: `CRYPTO-${uuidv4()}`,
            amount: details.amount,
            currency: details.currency,
            processedAt: new Date(),
        }
    }

    async recordPaymentTransaction(orderId, transactionResult) {
        return Order.update(
            {
                paymentStatus: transactionResult.success ? 'PAID' : 'FAILED',
                paymentTransactionId: transactionResult.transactionId,
                paymentMethod: transactionResult.paymentMethod,
                paymentProcessedAt: transactionResult.processedAt,
            },
            { where: { id: orderId } },
        )
    }
}

module.exports = new PaymentService()
