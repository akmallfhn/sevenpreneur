// components/emails/InvoiceEmail.tsx
import React from "react";

export type LineItem = {
  description: string;
  qty: number;
  price: number; // assume number, format later
};

interface Props {
  invoiceNumber: string;
  date: string;
  dueDate?: string;
  companyName?: string;
  companyAddress?: string;
  customerName: string;
  customerEmail?: string;
  items: LineItem[];
  notes?: string;
  currency?: string;
}

export default function InvoiceEmail({
  invoiceNumber,
  date,
  dueDate,
  companyName = "Sevenpreneur",
  companyAddress = "Jl. Contoh No.1, Jakarta",
  customerName,
  customerEmail,
  items,
  notes,
  currency = "IDR",
}: Props) {
  const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
  const tax = Math.round(subtotal * 0.11); // example 11% VAT
  const total = subtotal + tax;

  const format = (n: number) =>
    n.toLocaleString("id-ID", { style: "currency", currency: currency });

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style>{`
          /* Minimal reset for email clients */
          body { margin:0; padding:0; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
          table { border-collapse: collapse; }
        `}</style>
      </head>
      <body className="bg-gray-50 p-6">
        <center>
          <table
            width="600"
            style={{ maxWidth: 600 }}
            className="bg-white rounded-lg shadow-md"
            role="presentation"
          >
            <tbody>
              <tr>
                <td style={{ padding: 24 }}>
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 18,
                    }}
                  >
                    <div>
                      <h1 style={{ margin: 0, fontSize: 20 }}>{companyName}</h1>
                      <p style={{ margin: "6px 0 0", fontSize: 12 }}>
                        {companyAddress}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                        INVOICE
                      </p>
                      <p style={{ margin: "6px 0 0", fontSize: 12 }}>
                        #{invoiceNumber}
                      </p>
                    </div>
                  </div>

                  {/* Billing info */}
                  <table
                    width="100%"
                    role="presentation"
                    style={{ marginBottom: 18 }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ verticalAlign: "top", paddingRight: 12 }}>
                          <p
                            style={{
                              margin: "0 0 6px",
                              fontSize: 12,
                              color: "#444",
                            }}
                          >
                            Bill To:
                          </p>
                          <p
                            style={{ margin: 0, fontSize: 14, fontWeight: 600 }}
                          >
                            {customerName}
                          </p>
                          {customerEmail && (
                            <p style={{ margin: "6px 0 0", fontSize: 12 }}>
                              {customerEmail}
                            </p>
                          )}
                        </td>
                        <td
                          style={{ verticalAlign: "top", textAlign: "right" }}
                        >
                          <p style={{ margin: 0, fontSize: 12 }}>
                            Date: <strong>{date}</strong>
                          </p>
                          {dueDate && (
                            <p style={{ margin: "6px 0 0", fontSize: 12 }}>
                              Due: <strong>{dueDate}</strong>
                            </p>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Items table */}
                  <table
                    width="100%"
                    role="presentation"
                    style={{ borderTop: "1px solid #e5e7eb" }}
                  >
                    <thead>
                      <tr style={{ textAlign: "left" }}>
                        <th
                          style={{
                            padding: "12px 0",
                            fontSize: 12,
                            color: "#6b7280",
                          }}
                        >
                          Description
                        </th>
                        <th
                          style={{
                            padding: "12px 0",
                            fontSize: 12,
                            color: "#6b7280",
                            textAlign: "center",
                          }}
                        >
                          Qty
                        </th>
                        <th
                          style={{
                            padding: "12px 0",
                            fontSize: 12,
                            color: "#6b7280",
                            textAlign: "right",
                          }}
                        >
                          Price
                        </th>
                        <th
                          style={{
                            padding: "12px 0",
                            fontSize: 12,
                            color: "#6b7280",
                            textAlign: "right",
                          }}
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((it, idx) => (
                        <tr
                          key={idx}
                          style={{ borderTop: "1px solid #f3f4f6" }}
                        >
                          <td
                            style={{
                              padding: "12px 0",
                              verticalAlign: "top",
                              fontSize: 14,
                            }}
                          >
                            {it.description}
                          </td>
                          <td
                            style={{
                              padding: "12px 0",
                              textAlign: "center",
                              fontSize: 14,
                            }}
                          >
                            {it.qty}
                          </td>
                          <td
                            style={{
                              padding: "12px 0",
                              textAlign: "right",
                              fontSize: 14,
                            }}
                          >
                            {format(it.price)}
                          </td>
                          <td
                            style={{
                              padding: "12px 0",
                              textAlign: "right",
                              fontSize: 14,
                            }}
                          >
                            {format(it.qty * it.price)}
                          </td>
                        </tr>
                      ))}

                      {/* totals */}
                      <tr style={{ borderTop: "2px solid #e5e7eb" }}>
                        <td colSpan={2} />
                        <td
                          style={{
                            padding: "12px 0",
                            textAlign: "right",
                            fontSize: 14,
                          }}
                        >
                          Subtotal
                        </td>
                        <td
                          style={{
                            padding: "12px 0",
                            textAlign: "right",
                            fontSize: 14,
                          }}
                        >
                          {format(subtotal)}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} />
                        <td
                          style={{
                            padding: "12px 0",
                            textAlign: "right",
                            fontSize: 14,
                          }}
                        >
                          Tax (11%)
                        </td>
                        <td
                          style={{
                            padding: "12px 0",
                            textAlign: "right",
                            fontSize: 14,
                          }}
                        >
                          {format(tax)}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} />
                        <td
                          style={{
                            padding: "12px 0",
                            textAlign: "right",
                            fontSize: 16,
                            fontWeight: 700,
                          }}
                        >
                          Total
                        </td>
                        <td
                          style={{
                            padding: "12px 0",
                            textAlign: "right",
                            fontSize: 16,
                            fontWeight: 700,
                          }}
                        >
                          {format(total)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Notes */}
                  {notes && (
                    <div
                      style={{ marginTop: 18, fontSize: 13, color: "#374151" }}
                    >
                      <p style={{ margin: 0, fontWeight: 600 }}>Notes</p>
                      <p style={{ marginTop: 6 }}>{notes}</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div
                    style={{ marginTop: 24, fontSize: 12, color: "#6b7280" }}
                  >
                    <p style={{ margin: 0 }}>
                      If you have questions about this invoice, contact{" "}
                      {companyName}.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </center>
      </body>
    </html>
  );
}
