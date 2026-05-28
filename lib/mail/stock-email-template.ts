import { Stock } from "@/lib/stocks/stock-api";

export function generateStockEmailTemplate(stocks: Stock[]): string {
    const positiveStocks = stocks.filter(stock => stock.changesPercentage > 0);

    if (positiveStocks.length === 0) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #2563eb;">📊 Stock Ping Daily Update</h1>
                <p>Heute gibt es keine Aktien mit positiver Performance zu berichten.</p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 12px;">
                    Du erhältst diese E-Mail, weil du dich für Stock Ping Daily Updates angemeldet hast.
                </p>
            </div>
        `;
    }

    const stockRows = positiveStocks.map((stock, index) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px; text-align: center; font-weight: bold; color: #6b7280;">
                #${index + 1}
            </td>
            <td style="padding: 12px;">
                <div style="font-weight: bold; color: #1f2937;">${stock.name}</div>
                <div style="color: #6b7280; font-size: 12px;">${stock.symbol} · ${stock.exchange}</div>
            </td>
            <td style="padding: 12px; text-align: right;">
                <div style="font-weight: bold; color: #1f2937;">$${stock.price.toFixed(2)}</div>
            </td>
            <td style="padding: 12px; text-align: right;">
                <div style="font-weight: bold; color: #10b981;">
                    +${stock.changesPercentage.toFixed(2)}%
                </div>
                <div style="color: #10b981; font-size: 12px;">
                    +$${stock.change.toFixed(2)}
                </div>
            </td>
        </tr>
    `).join('');

    return `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h1 style="color: #2563eb; margin-bottom: 10px;">📈 Stock Ping Daily Update</h1>
                <p style="color: #6b7280; margin-bottom: 20px;">
                    Hier sind die besten ${positiveStocks.length} Aktien mit positiver Performance von heute:
                </p>

                <table style="width: 100%; border-collapse: collapse; background-color: white;">
                    <thead>
                        <tr style="background-color: #f3f4f6; border-bottom: 2px solid #e5e7eb;">
                            <th style="padding: 12px; text-align: center; color: #6b7280; font-size: 12px;">#</th>
                            <th style="padding: 12px; text-align: left; color: #6b7280; font-size: 12px;">AKTIE</th>
                            <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 12px;">PREIS</th>
                            <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 12px;">ÄNDERUNG</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${stockRows}
                    </tbody>
                </table>

                <div style="margin-top: 30px; padding: 15px; background-color: #eff6ff; border-left: 4px solid #2563eb; border-radius: 4px;">
                    <p style="margin: 0; color: #1e40af; font-size: 14px;">
                        💡 <strong>Hinweis:</strong> Diese Informationen dienen nur zu Informationszwecken und stellen keine Anlageberatung dar.
                    </p>
                </div>

                <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

                <p style="color: #6b7280; font-size: 12px; text-align: center;">
                    Du erhältst diese E-Mail, weil du dich für Stock Ping Daily Updates angemeldet hast.<br>
                    Letzte Aktualisierung: ${new Date().toLocaleString('de-DE')}
                </p>
            </div>
        </div>
    `;
}
