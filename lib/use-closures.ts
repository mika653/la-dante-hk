"use client";
// Loads the shared closures list (holidays + PLIDA days) from the database once,
// for any client component that schedules courses. It starts from the built-in
// seeds so the scheduler has sensible dates on the very first render, then swaps
// in the real shared list as soon as it arrives. `reload` re-fetches after an edit.
import { useCallback, useEffect, useState } from "react";
import { getClosures } from "@/lib/closures-actions";
import { HK_HOLIDAYS_SEED, PLIDA_DATES_SEED, type Holiday, type PlidaDate } from "@/lib/closures-shared";

export function useClosures() {
  const [holidays, setHolidays] = useState<Holiday[]>(HK_HOLIDAYS_SEED);
  const [plida, setPlida] = useState<PlidaDate[]>(PLIDA_DATES_SEED);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const c = await getClosures();
      setHolidays(c.holidays);
      setPlida(c.plida);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  return { holidays, plida, loading, error, reload };
}
