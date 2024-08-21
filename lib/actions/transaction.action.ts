"use server"

import { redirect } from "next/navigation"
import Stripe from "stripe"
import { handleError } from "../utils"
import { connectToDatabase } from "../database/mongoose"
import Transaction from "../database/models/transaction.model"
import { updateCredits } from "./user.actions"

// 结帐服务
export async function checkoutCredits(transaction: CheckoutTransactionParams){
    // 创建stripe实例, !是表示确定有值
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

    // 将金额转换为分
    const amount = Number(transaction.amount) * 100

    // 创建一个新的Stripe 结账会话（checkout session）
    const session = await stripe.checkout.sessions.create({
        // 指定结账会话的商品（line items）
        line_items: [
            {
                // 设置价格数据
                price_data: {
                    // 设置货币为美元
                    currency: 'usd',
                    // 商品的单价（单位为分），这里的‘amount’变量是价格值
                    unit_amount: amount,
                    // 设置商品数据
                    product_data: {
                        // 商品名称，这里使用transaction.plan
                        name: transaction.plan,
                    }
                },
                // 每次购买一次商品
                quantity: 1,
            }
        ],
        // 设置元数据,用于保存于结账相关的自定义信息
        metadata: {
            // 保存商品名称
            plan: transaction.plan,
            // 保存信用额度
            credits: transaction.credits,
            // 保存购买者ID
            buyerId: transaction.buyerId,
        },
        // 设置结账模式为支付模式（'payment'）
        mode: 'payment',
        // 设置成功后的重定向URL
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
        // 设置取消后的重定向URL
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    })

    // 重定向到stripe的结账页面
    redirect(session.url!)
}

// 创建交易
export async function createTransaction(transaction: CreateTransactionParams){
    try {
        // 连接数据库
        await connectToDatabase()

        // 用buyerId创建一个新的交易
        const newTransaction = await Transaction.create({
            ...transaction, 
            buyer: transaction.buyerId,
        })

        // 更新用户的信用额度
        await updateCredits(transaction.buyerId, transaction.credits)

        return JSON.parse(JSON.stringify(newTransaction))
    } catch (error) {
        handleError(error)
    }
}