// VocalOS Stripe 支付服务
import Stripe from "stripe";

// 初始化 Stripe（使用 secret key）
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

export const stripe = stripeSecretKey && stripeSecretKey.length > 20
  ? new Stripe(stripeSecretKey, { apiVersion: "2024-04-10" })
  : null;

export const isStripeConfigured = !!stripe;

// ============ 支付套餐定义 ============

export interface Plan {
  id: string;
  name: string;
  price: number;
  priceId: string;  // Stripe Price ID
  features: string[];
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "免费版",
    price: 0,
    priceId: "",
    features: [
      "3 个项目",
      "1 次导出",
      "基础提示词",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 299,
    priceId: "price_pro_monthly",
    features: [
      "无限项目",
      "无限导出",
      "AI 生成",
      "优先支持",
    ],
  },
  {
    id: "studio",
    name: "Studio",
    price: 699,
    priceId: "price_studio_monthly",
    features: [
      "Pro 全部",
      "API 调用",
      "自定义品牌",
      "专属客服",
    ],
  },
];

// ============ 创建支付会话 ============

export async function createCheckoutSession(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  if (!stripe) {
    throw new Error("Stripe not configured");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
  });

  return session;
}

// ============ 创建客户门户会话 ============

export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
) {
  if (!stripe) {
    throw new Error("Stripe not configured");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

// ============ 获取订阅状态 ============

export async function getSubscription(subscriptionId: string) {
  if (!stripe) {
    return null;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
}

// ============ 处理 Webhook ============

export async function handleWebhook(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
) {
  if (!stripe) {
    throw new Error("Stripe not configured");
  }

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    webhookSecret
  );

  switch (event.type) {
    case "checkout.session.completed":
      // 处理支付成功
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Payment successful:", session.id);
      break;
    case "customer.subscription.updated":
      // 处理订阅更新
      break;
    case "customer.subscription.deleted":
      // 处理订阅取消
      break;
    default:
      console.log("Unhandled event type:", event.type);
  }

  return event;
}