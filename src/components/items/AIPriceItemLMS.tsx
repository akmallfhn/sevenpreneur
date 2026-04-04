import { AIPriceType } from "@/lib/app-types";
import { getRupiahCurrency } from "@/lib/currency";

const priceVariant: Record<
  AIPriceType,
  {
    title: string;
    desc: string;
    background: string;
    label_background: string;
    color: string;
  }
> = {
  value: {
    title: "Value Based Price",
    desc: "Harga berdasarkan pada perceived value dan willingness-to-pay yang selaras dengan manfaat",
    background: "bg-[#F6F6FD] border-[#4F41B6]",
    label_background: "bg-[#E8E7FC]",
    color: "text-[#4F41B6]",
  },
  cost: {
    title: "Cost Based Price",
    desc: "Harga berdasarkan keseluruhan biaya produksi lalu menambahkan margin yang realistis",
    background: "bg-[#FFFEF6] border-warning-foreground",
    label_background: "bg-warning-background",
    color: "text-warning-foreground",
  },
  competition: {
    title: "Competition Based Price",
    desc: "Harga berdasarkan landscape kompetitor dan benchmark pasar",
    background: "bg-[#F5F1F6] border-danger-foreground",
    label_background: "bg-danger-background",
    color: "text-danger-foreground",
  },
};

interface AIPriceItemLMSProps {
  estimatedPrice: number;
  marginProfit: number;
  profit: number;
  variant: AIPriceType;
  isSelected: boolean;
  onSelect: () => void;
}

export default function AIPriceItemLMS(props: AIPriceItemLMSProps) {
  const priceVar = priceVariant[props.variant];

  return (
    <div
      className={`value-based-price flex flex-col w-full font-bodycopy p-4 gap-2 rounded-lg hover:cursor-pointer ${
        props.isSelected
          ? `border ${priceVar.background}`
          : "bg-white border border-outline"
      }`}
      onClick={props.onSelect}
    >
      <div className="flex w-full items-center justify-between gap-5">
        <div className="flex flex-col gap-1">
          <h4
            className={`w-fit font-bold py-1 px-3 text-[15px] rounded-full ${priceVar.label_background} ${priceVar.color}`}
          >
            {priceVar.title}
          </h4>
          <p className="text-[15px] text-[#111111]/80">{priceVar.desc}</p>
        </div>
        <h2
          className={`font-brand font-bold text-2xl shrink-0 ${
            props.isSelected ? `${priceVar.color}` : "text-black"
          }`}
        >
          {getRupiahCurrency(Math.round(props.estimatedPrice))}
        </h2>
      </div>
      <hr className="border-b border-outline" />
      <div className="flex flex-col">
        <div className="flex w-full items-center justify-between text-[15px] text-[#111111]">
          <p className="font-medium">Persentase Margin per Unit</p>
          <p className="font-semibold">{props.marginProfit}%</p>
        </div>
        <div className="flex w-full items-center justify-between text-[15px] text-[#111111]">
          <p className="font-medium">Profit per Unit</p>
          <p className="font-semibold">{getRupiahCurrency(props.profit)}</p>
        </div>
      </div>
    </div>
  );
}
