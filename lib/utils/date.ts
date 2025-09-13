export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function formatDateTime(date: Date | string, time: string): string {
  return `${formatDate(date)} at ${formatTime(time)}`;
}

export function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isFuture(date: Date): boolean {
  return date > new Date();
}

export function isPast(date: Date): boolean {
  return date < new Date();
}

export function getDayOfWeek(date: Date): number {
  return date.getDay(); // 0 = Sunday, 1 = Monday, etc.
}

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  intervalMinutes: number = 60
): string[] {
  const slots: string[] = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMinute = startMinute;
  
  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMinute < endMinute)
  ) {
    const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute
      .toString()
      .padStart(2, '0')}`;
    slots.push(timeString);
    
    currentMinute += intervalMinutes;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute = currentMinute % 60;
    }
  }
  
  return slots;
}

export function isTimeSlotAvailable(
  date: Date,
  time: string,
  bookedSlots: { date: Date; startTime: string; endTime: string }[]
): boolean {
  return !bookedSlots.some(
    (slot) =>
      isSameDay(slot.date, date) &&
      time >= slot.startTime &&
      time < slot.endTime
  );
}