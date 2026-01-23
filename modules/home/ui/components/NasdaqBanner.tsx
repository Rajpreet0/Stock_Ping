"use client";

import { Clock, TriangleAlert } from "lucide-react";


const NasdaqBanner = () => {

    const now = new Date();

    const parts = new Intl.DateTimeFormat("de-DE", {
        timeZone: "Europe/Berlin",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        weekday: "short"
    }).formatToParts(now);

    const weekday = parts.find(p => p.type === "weekday")?.value;
    const hour = Number(parts.find(p => p.type === "hour")?.value);
    const minute = Number(parts.find(p => p.type === "minute")?.value);

    // Check if it's a weekday
    const isWeekday = weekday && !["Sa.", "So."].includes(weekday);

    // Check if market is open
    const isMarketOpen = isWeekday && (
        (hour === 15 && minute >= 30) ||
        (hour > 15 && hour < 22) ||
        (hour === 22 && minute === 0)
    );

    // Show warning before market opens
    const showOpeningSoonBanner = isWeekday && (hour < 15 || (hour === 15 && minute < 30));

    // Show message when market is closed (after 22:00 or on weekends)
    const showClosedBanner = !isMarketOpen && !showOpeningSoonBanner;

  return (
    <div>
        {showOpeningSoonBanner && (
          <div className="flex
              items-center justify-center gap-4 w-full p-4 mt-2 bg-yellow-100 text-center text-yellow-900 rounded border border-yellow-300">
              <TriangleAlert className="w-5 h-5"/>
              <p>NASDAQ öffnet heute um 15:30 Uhr (deutsche Zeit)</p>
          </div>
        )}

        {isMarketOpen && (
          <div className="flex
              items-center justify-center gap-4 w-full p-4 mt-2 bg-green-100 text-center text-green-900 rounded border border-green-300">
              <Clock className="w-5 h-5"/>
              <p>NASDAQ ist geöffnet (15:30 - 22:00 Uhr deutsche Zeit) - Kurse werden aktualisiert</p>
          </div>
        )}

        {showClosedBanner && (
          <div className="flex
              items-center justify-center gap-4 w-full p-4 mt-2 bg-gray-100 text-center text-gray-900 rounded border border-gray-300">
              <Clock className="w-5 h-5"/>
              <p>NASDAQ ist geschlossen - Nächste Öffnung: {isWeekday ? "heute" : "Montag"} um 15:30 Uhr</p>
          </div>
        )}
    </div>
  )
}

export default NasdaqBanner