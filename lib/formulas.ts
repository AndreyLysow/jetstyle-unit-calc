
export type Inputs = {
  cpc: number;   // Cost Per Click
  cr: number;    // Conversion Rate, % → доля
  cps: number;   // Conversion to Sale, % → доля
  avp: number;   // Average Purchase Value
  cogs: number;  // Cost of Goods Sold
  ret: number;   // Retention (покупок за LTV)
  au: number;    // Audience
};

export function computeClient(i: Inputs) {
  const cr = i.cr / 100;
  const cps = i.cps / 100;

  const clicksCost = i.au * i.cpc;
  const leads = i.au * cr;
  const buyers = leads * cps;
  const revenueOne = i.avp - i.cogs;
  const profitPerPayingUser = revenueOne * i.ret;
  const grossProfit = buyers * profitPerPayingUser;
  const operatingProfit = grossProfit - clicksCost;

  return { clicksCost, leads, buyers, profitPerPayingUser, grossProfit, operatingProfit };
}