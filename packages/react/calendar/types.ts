export type Calendar = {
  id: string;
  color: string;
  /**
   * If not defined the name is gathered from the remote calendar response,
   * for google calendars that comes from the `summary` value.
   */
  name?: string;
};

export type Calendars = Calendar[];

export type CalendarsMap = Record<
  Calendar["id"],
  Required<Calendar> & {
    on?: boolean;
    events?: number;
  }
>;

export type CalendarRange = [Date, Date];

export type CalendarView = "month" | "week";

export type CalendarEvent = {
  calendar: Calendar;
  /**
   * List of day timestamps across which the event spans
   */
  days: number[];
  /**
   * Lookup object for day timestamps across which the event spans
   */
  daysMap: Record<number, 1>;
  /**
   * Flag for events that spans across multiple days
   */
  multi: boolean;
  allDay: boolean;
  link: string;
  title: string;
  status: string;
  created: Date;
  start: Date;
  end: Date;
  color: string;
  location: string;
  description: string;
  uid: string;
};

/**
 * Calendar events mapped by day `timestamp` number
 */
export type CalendarEventsByTimestamp = Record<number, CalendarEventsMap>;

/**
 * Calendar events map by `uid`
 */
export type CalendarEventsMap = Record<CalendarEvent["uid"], CalendarEvent>;

export type CalendarViewWeeks = CalendarViewWeek[];

export type CalendarViewWeek = {
  props: { key: string };
  days: CalendarViewDay[];
};

export type CalendarViewDay = {
  props: { key: string } & CalendarViewDayProps;
  label: string;
  timestamp: string;
  events: CalendarViewEvent[];
};

export type CalendarViewDayProps = {
  $isToday?: boolean;
  $isOutOfRange?: boolean;
};

export type CalendarViewEvent =
  | {
      key: string;
      placeholder: true;
      top: number;
    }
  | (CalendarEvent &
      CalendarViewDayProps & {
        key: string;
        placeholder?: false;
        top: number;
        width: number;
        firstOfMulti?: boolean;
        isPast?: boolean;
      });
