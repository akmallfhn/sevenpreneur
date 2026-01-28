import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

interface PaymentChannelCalculationData {
  calc_percent: Decimal;
  calc_flat: Decimal;
  calc_vat: boolean;
}

export function calculateFinalPrice(
  initialPrice: Prisma.Decimal,
  paymentChannel: PaymentChannelCalculationData
) {
  const ZERO = new Prisma.Decimal(0);
  const ONE = new Prisma.Decimal(1);
  const VAT_AMOUNT = new Prisma.Decimal(0.11);
  const calculatedPrices = {
    adminFee: ZERO,
    vat: ZERO,
    finalPrice: ZERO,
  };

  // If the price is already zero (free of charge), return zero for all prices.
  if (initialPrice.equals(ZERO)) {
    return calculatedPrices;
  }

  const percentValue = paymentChannel.calc_percent.dividedBy(100);
  const flatValue = paymentChannel.calc_flat;

  let vat_mult = ZERO;
  if (paymentChannel.calc_vat) {
    vat_mult = VAT_AMOUNT;
  }

  // No transaction fee //
  if (percentValue.equals(ZERO) && flatValue.equals(ZERO)) {
    calculatedPrices.finalPrice = initialPrice;
  }

  // Transaction fee by a percentage of the transaction value //
  // initialPrice = finalPrice - percent * finalPrice - vat_mult * percent * finalPrice
  // initialPrice = finalPrice * (1 - percent - vat_mult * percent)
  // initialPrice = finalPrice * (1 - percent * (1 + vat_mult))
  // finalPrice = initialPrice / (1 - percent * (1 + vat_mult))
  if (percentValue.greaterThan(ZERO) && flatValue.equals(ZERO)) {
    calculatedPrices.finalPrice = initialPrice.dividedBy(
      ONE.minus(percentValue.mul(ONE.plus(vat_mult)))
    );
  }

  // Transaction fee by a fixed amount //
  // initialPrice = finalPrice - flat - vat_mult * flat
  // initialPrice = finalPrice - flat * (1 + vat_mult)
  // finalPrice = initialPrice + flat * (1 + vat_mult)
  if (percentValue.equals(ZERO) && flatValue.greaterThan(ZERO)) {
    calculatedPrices.finalPrice = initialPrice.plus(
      flatValue.mul(ONE.plus(vat_mult))
    );
  }

  // Transaction fee by both //
  // initialPrice = finalPrice - (percent * finalPrice + flat) - vat_mult * (percent * finalPrice + flat)
  // initialPrice = finalPrice - percent * finalPrice - flat - vat_mult * percent * finalPrice - vat_mult * flat
  // initialPrice = finalPrice - finalPrice * (percent + vat_mult * percent) - flat * (1 + vat_mult)
  // initialPrice = finalPrice - finalPrice * (percent * (1 + vat_mult)) - flat * (1 + vat_mult)
  // initialPrice = finalPrice * (1 - percent * (1 + vat_mult)) - flat * (1 + vat_mult)
  // initialPrice + flat * (1 + vat_mult) = finalPrice * (1 - percent * (1 + vat_mult))
  // finalPrice = (initialPrice + flat * (1 + vat_mult)) / (1 - percent * (1 + vat_mult))
  if (percentValue.greaterThan(ZERO) && flatValue.greaterThan(ZERO)) {
    calculatedPrices.finalPrice = initialPrice
      .plus(flatValue.mul(ONE.plus(vat_mult)))
      .dividedBy(ONE.minus(percentValue.mul(ONE.plus(vat_mult))));
  }

  // diff = finalPrice - initialPrice
  const diff = calculatedPrices.finalPrice.minus(initialPrice);

  // adminFee = diff * 1 / (1 + vat_mult)
  calculatedPrices.adminFee = diff.dividedBy(ONE.plus(vat_mult));

  // vat = diff * vat_mult / (1 + vat_mult)
  calculatedPrices.vat = diff.mul(vat_mult).dividedBy(ONE.plus(vat_mult));

  return calculatedPrices;
}
