export const BOOKING_FEES_PERCENTAGE = "BOOKING_FEES_PERCENTAGE";
export const BOOKING_FEES_FIXED = "BOOKING_FEES_FIXED";
export const BOOKING_FEES_ZERO = "BOOKING_FEES_ZERO";
export const BOOKING_FEES_TYPE = BOOKING_FEES_FIXED;
export const BOOKING_FEES_GUEST_FIXED = 5;
export const BOOKING_FEES_GUEST = 0.05;
export const BOOKING_FEES_HOST = 0.05;

export const BOOKING_CATEGORY_STANDARD = "STANDARD"; //host can accept or deny
export const BOOKING_CATEGORY_DIRECT = "DIRECT"; //host can accept or deny

export const S3_FOLDER_USER = "users";
export const S3_FOLDER_BOAT = "boats";

export const BOOKING_STATE_PENDING = "pending";
export const BOOKING_STATE_ACCEPTED = "accepted";
export const BOOKING_STATE_CANCELLED = "cancelled";
export const BOOKING_STATE_BLOCKED = "blocked"; //accepted not editable
export const BOOKING_STATE_INPROGRESS = "in progress";
export const BOOKING_STATE_FINISHED = "finished";
export const BOOKING_STATE_CLOSED = "closed";
export const BOOKING_STATE_ABORTED = "aborted";

export const FALLBACK_REGION = {latitude: 46.01008, latitudeDelta: 0.0922, longitude: 9.96004, longitudeDelta: 0.0421};

export const DEFAULT_BOAT_IMAGE = "HIDDEN";

export const ISO_WEEKDAYS = [{code: 1, value: "monday"}, {code: 2, value: "tuesday"}, {code: 3, value: "wednesday"},
    {code: 4, value: "thursday"}, {code: 5, value: "friday"}, {code: 6, value: "saturday"}, {
        code: 7,
        value: "sunday"
    }];

export const BOAT_ID_PREFIX = "BOAT#";
export const BOAT_ID_LENGTH_NO_PREFIX = 27;

export const DEFAULT_CURRENCY = 'EUR';
export const MAX_NUM_PRICES = 5;