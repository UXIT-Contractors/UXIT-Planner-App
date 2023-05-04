import { NavigationBar } from "../components/aria/navigation-bar";
import { DateSwitcher } from "../components/aria/date-switcher";
import { Schedule } from "../components/aria/schedule";
import { Button } from "../components/aria/button";
import { Zap } from "react-feather";
import { useEffect, useState } from "react";
import { api } from "../utils/api";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const weekStart = new Date(new Date('2023-04-18T00:00:00Z').setHours(0, 0, 0, 0))

  useEffect(() => {
    setSelectedDate(new Date(new Date().setHours(0, 0, 0, 0)))
    console.log('useEffect')
  }, [])

  const context = api.useContext();
  const { mutate: generateSchedule } = api.schedule.generate.useMutation({
    onSuccess: () => {
      context.staffing.getStaffing.invalidate({ from: weekStart }).catch((error) => {
        console.error(error);
      });
      context.schedule.getUnfulfilledShifts.invalidate().catch((error) => {
        console.error(error);
      });
    }
  });

  if (!selectedDate) return (
    <div>Loading...</div>
  )

  return (
    <div>
      <Button color="success" fillWidth onPress={() => { generateSchedule() }}>
        <b>Genereer rooster</b><Zap className="ml-2" />
      </Button>
      <DateSwitcher selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <Schedule selectedDate={selectedDate} weekStart={weekStart} />
      <NavigationBar />
    </div>
  );
};

export default Index;