
import { Activity, Center } from "../types/activity";
import { v4 as uuidv4 } from 'uuid';

export const centers: Center[] = [
  { id: 1, name: "مركز شباب جرش" },
  { id: 2, name: "مركز شابات جرش" },
  { id: 3, name: "مركز شباب وشابات سوف" },
  { id: 4, name: "مركز شباب كفر خل" },
  { id: 5, name: "مركز شباب ساكب" },
  { id: 6, name: "مركز شابات ساكب" },
  { id: 7, name: "مركز شباب برما" },
  { id: 8, name: "مركز شباب وشابات الجزازة" },
  { id: 9, name: "مركز شباب قفقفا" },
  { id: 10, name: "مركز شباب باب عمان" },
  { id: 11, name: "مركز شابات بليلا" },
  { id: 12, name: "مركز المديرية" },
];

// Generate some initial activities
const currentDate = new Date();
const oneDay = 24 * 60 * 60 * 1000;

export const initialActivities: Activity[] = [
  {
    id: uuidv4(),
    name: "ورشة عمل تدريبية عن الروبوتات (تدريبي)",
    center: "مركز شباب جرش",
    location: "القاعة الكبرى",
    startDate: new Date(currentDate.getTime() + oneDay).toISOString().split('T')[0],
    endDate: new Date(currentDate.getTime() + oneDay).toISOString().split('T')[0],
    status: "preparing",
  },
  {
    id: uuidv4(),
    name: "دورة تصوير فوتوغرافي تدريبية (تدريبي)",
    center: "مركز شابات جرش",
    location: "استوديو المركز",
    startDate: new Date(currentDate.getTime() + 2 * oneDay).toISOString().split('T')[0],
    endDate: new Date(currentDate.getTime() + 7 * oneDay).toISOString().split('T')[0],
    status: "preparing",
  },
  {
    id: uuidv4(),
    name: "مباراة كرة سلة ودية (تدريبية)",
    center: "مركز شباب كفر خل",
    location: "صالة الألعاب الرياضية",
    startDate: new Date(currentDate.getTime() + 9 * oneDay).toISOString().split('T')[0],
    endDate: new Date(currentDate.getTime() + 9 * oneDay).toISOString().split('T')[0],
    status: "completed",
  },
  {
    id: uuidv4(),
    name: "مخيم كشفي تدريبي",
    center: "مركز شباب وشابات سوف",
    location: "منطقة التخييم بالغابة",
    startDate: new Date(currentDate.getTime() - 4 * oneDay).toISOString().split('T')[0],
    endDate: new Date(currentDate.getTime() + 3 * oneDay).toISOString().split('T')[0],
    status: "completed",
  },
  {
    id: uuidv4(),
    name: "ندوة حول ريادة الأعمال (تدريبية)",
    center: "مركز شباب باب عمان",
    location: "قاعة المحاضرات",
    startDate: new Date(currentDate.getTime() + 6 * oneDay).toISOString().split('T')[0],
    endDate: new Date(currentDate.getTime() + 6 * oneDay).toISOString().split('T')[0],
    status: "cancelled",
  },
];

// Function to calculate days remaining
export const getDaysRemaining = (dateStr: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / oneDay);
  
  return diffDays;
};

// Function to check if an activity needs an alert
export const needsAlert = (activity: Activity): number | null => {
  const daysRemaining = getDaysRemaining(activity.startDate);
  
  if (daysRemaining <= 1 && daysRemaining >= 0) {
    return 1; // 1 day or less remaining
  } else if (daysRemaining <= 3 && daysRemaining > 1) {
    return 3; // 1-3 days remaining
  }
  
  return null; // No alert needed
};
