import { ComponentPropsWithoutRef, Fragment, useState } from "react";
import { MdAdd as IconExpand } from "@react-icons/all-files/md/MdAdd";
import { MdRemove as IconCollapse } from "@react-icons/all-files/md/MdRemove";
import type { KoineComponentProps, KoineComponent } from "../types";
import type {
  CalendarsMap,
  CalendarView,
  CalendarViewEvent,
  CalendarViewDayProps,
} from "./types";
import { getDisplayTime } from "./utils";
import { UseCalendarReturn } from "./useCalendar";

export type KoineCalendarDaygridCellProps = {
  eventClicked?: UseCalendarReturn["eventClicked"];
  setEventClicked: UseCalendarReturn["setEventClicked"];
  eventHovered?: UseCalendarReturn["eventHovered"];
  setEventHovered: UseCalendarReturn["setEventHovered"];
  view: CalendarView;
  maxEvents: number;
  events: CalendarViewEvent[];
  calendarsMap: CalendarsMap;
};

export type CalendarDaygridCellStyledProps = CalendarViewDayProps & {
  $view: CalendarView;
  $selected?: boolean;
  $past?: boolean;
  $color: string;
};

export type CalendarDaygridCellEventProps = ComponentPropsWithoutRef<"div"> &
  (
    | (CalendarDaygridCellStyledProps & {
        $placeholder?: false;
      })
    | {
        $placeholder: true;
      }
  );

export type CalendarDaygridCellEventBtnProps = CalendarDaygridCellEventProps;

export type CalendarDaygridCellComponents = {
  Cell?: KoineComponent;
  CellOverflow?: KoineComponent;
  CellEvent?: KoineComponent<CalendarDaygridCellEventProps>;
  CellEventBtn?: KoineComponent<CalendarDaygridCellEventBtnProps>;
  CellEventTitle?: KoineComponent;
  CellEventStart?: KoineComponent;
};

export type CalendarDaygridCellProps = KoineComponentProps<
  KoineCalendarDaygridCellProps,
  CalendarDaygridCellComponents
>;

/**
 * Style for button within a event cell
 *
 * Here we might differentiate week/month view where the first does not get
 * ellipsed btn texts, with `Start` as block element and underneath the `Title`
 * on multiple lines, but that would mean that we loose the ability to interweave
 * single-day events among the spaces left by wider multi-days events.
 */
const styleBtn = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
} as const;

export const CalendarDaygridCell = ({
  eventClicked,
  setEventClicked,
  // eventHovered,
  setEventHovered,
  view,
  maxEvents,
  events,
  calendarsMap,
  Koine,
}: CalendarDaygridCellProps) => {
  const [isExpanded, expand] = useState(false);
  const {
    Cell = "div",
    CellOverflow = "div",
    CellEvent = "div",
    CellEventBtn = "div",
    CellEventTitle = "span",
    CellEventStart = "span",
  } = Koine;

  const eventsWithoutPlaceholders = events.filter(
    (event) => !event.placeholder
  );

  return (
    <Cell>
      {events.map((event, i) => {
        if (i === maxEvents && !isExpanded) {
          return (
            <CellOverflow
              key={"overflowMessage" + i}
              onClick={() => expand(true)}
            >
              <IconExpand />
              {eventsWithoutPlaceholders.length - maxEvents}
            </CellOverflow>
          );
        }
        if (i > maxEvents && !isExpanded) return null;

        if (event.placeholder) {
          return (
            <Fragment key={event.key}>
              <CellEvent $placeholder>
                <CellEventBtn
                  aria-hidden="true"
                  style={{ visibility: "hidden" }}
                  $placeholder
                >
                  <CellEventTitle>&nbsp;</CellEventTitle>
                </CellEventBtn>
              </CellEvent>
            </Fragment>
          );
        }

        const styleEvent = {
          zIndex: event.firstOfMulti ? 1 : 0, // to cover the following event days
          position: "relative",
          width: event.firstOfMulti ? `${100 * event.width}%` : "100%",
        } as const;

        if (!calendarsMap[event.calendar.id].on) {
          // @ts-expect-error nevermind
          styleBtn.display = "none";
        }

        const styledProps = {
          $view: view,
          $selected: eventClicked?.uid === event.uid,
          $past: event.isPast,
          $color: event.color,
          $isOutOfRange: event.$isOutOfRange,
          $isToday: event.$isToday,
        };

        return (
          <Fragment key={event.key}>
            <CellEvent style={styleEvent} {...styledProps}>
              <CellEventBtn
                role="button"
                style={styleBtn}
                {...styledProps}
                onClick={() =>
                  setEventClicked((prev) =>
                    prev?.uid === event.uid ? null : event
                  )
                }
                onMouseEnter={() => setEventHovered(event)}
                onMouseLeave={() => setEventHovered(null)}
              >
                {event.allDay ? (
                  <CellEventTitle>{event.title}</CellEventTitle>
                ) : (
                  <>
                    <CellEventStart>
                      {getDisplayTime(event.start)}
                    </CellEventStart>
                    <CellEventTitle>{event.title}</CellEventTitle>
                  </>
                )}
              </CellEventBtn>
            </CellEvent>
            {/* {i === events.length - 1 && isExpanded ? (
              <CellOverflow onClick={() => expand(false)}>
                <IconCollapse />
                Show less
              </CellOverflow>
            ) : null} */}
          </Fragment>
        );
      })}
    </Cell>
  );
};
