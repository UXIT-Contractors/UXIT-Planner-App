import { NavigationBar } from "../components/elements/navigation-bar";
import { Schedule } from "../components/elements/schedule/schedule";
import { useEffect, useState } from "react";
import { WeekView } from "../components/elements/schedule/weekView";
import { CalendarDate, parseDate, toCalendarDateTime } from "@internationalized/date";


const Index = () => {
  const [selectedDate, setSelectedDate] = useState<typeof CalendarDate>(null);

  useEffect(() => {
    setSelectedDate(parseDate(new Date(new Date().setHours(2, 0, 0, 0)).toISOString().slice(0, 10)))
  }, [])

  if (!selectedDate) return (
    <div>Loading...</div>
  )

  return (
    <div>
      <WeekView value={selectedDate} onChange={setSelectedDate} />
      <Schedule selectedDate={toCalendarDateTime(selectedDate)} />
      <NavigationBar />
    </div>
  );
};

export default Index;
