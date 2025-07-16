import { PaymentChannel, Prisma } from "@prisma/client";

export function calculateFinalPrice(
  initialPrice: Prisma.Decimal,
  paymentChannel: PaymentChannel
) {
  const ZERO = new Prisma.Decimal(0);
  const ONE = new Prisma.Decimal(1);
  const VAT_AMOUNT = new Prisma.Decimal(0.11);
  const calculatedPrices = {
    adminFee: ZERO,
    finalPrice: ZERO,
  };

  let vat = ZERO;
  if (paymentChannel.calc_vat) {
    vat = VAT_AMOUNT;
  }

  // No transaction fee //
  if (
    paymentChannel.calc_percent.equals(ZERO) &&
    paymentChannel.calc_flat.equals(ZERO)
  ) {
    calculatedPrices.finalPrice = initialPrice;
  }

  // Transaction fee by a percentage of the transaction value //
  // initialPrice = finalPrice - percent * finalPrice - vat * percent * finalPrice
  // initialPrice = finalPrice * (1 - percent - percent * vat)
  // initialPrice = finalPrice * (1 - percent * (1 + vat))
  // finalPrice = initialPrice / (1 - percent * (1 + vat))
  if (
    paymentChannel.calc_percent.greaterThan(ZERO) &&
    paymentChannel.calc_flat.equals(ZERO)
  ) {
    calculatedPrices.finalPrice = initialPrice.dividedBy(
      ONE.minus(paymentChannel.calc_percent.mul(ONE.plus(vat)))
    );
  }

  // Transaction fee by a fixed amount //
  // initialPrice = finalPrice - flat - vat * flat
  // initialPrice = finalPrice - flat * (1 + vat)
  // finalPrice = initialPrice + flat * (1 + vat)
  if (
    paymentChannel.calc_percent.equals(ZERO) &&
    paymentChannel.calc_flat.greaterThan(ZERO)
  ) {
    calculatedPrices.finalPrice = initialPrice.plus(
      paymentChannel.calc_flat.mul(ONE.plus(vat))
    );
  }

  // Not supported: both //
  if (
    paymentChannel.calc_percent.greaterThan(ZERO) &&
    paymentChannel.calc_flat.greaterThan(ZERO)
  ) {
    throw new Error(
      "Final price calculation with both percent and flat fee is not supported."
    );
  }

  // adminFee = finalPrice - initialPrice
  calculatedPrices.adminFee = calculatedPrices.finalPrice.minus(initialPrice);

  return calculatedPrices;
}
