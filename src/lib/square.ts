export const SQUARE_BOOKING_URL =
  "https://book.squareup.com/appointments/a1866bee-e25a-447d-a0ee-039f76a608d6/location/5V21SB1DSG5AG/services";

export const SQUARE_FACIAL_BOOKING_URL =
  "https://book.squareup.com/appointments/a1866bee-e25a-447d-a0ee-039f76a608d6/location/5V21SB1DSG5AG/services/2OEMVOESATGLX2YCAYLSFZ35?savt=935462c3-fb58-4232-9f54-a17ed5b05f58";

export const SQUARE_WIDGET_EMBED_URL =
  "https://squareup.com/appointments/buyer/widget/a1866bee-e25a-447d-a0ee-039f76a608d6/5V21SB1DSG5AG";

export const GOOGLE_MAPS_EMBED_URL =
  "https://maps.google.com/maps?q=Community%20Corners%20Plaza%20903%20Hanshaw%20Road%20Ithaca%20NY%2014850&t=m&z=15&output=embed&iwloc=near";

export const GOOGLE_MAPS_DIRECTIONS_URL =
  "https://maps.google.com/?q=903+Hanshaw+Rd+Suite+104+Ithaca+NY+14850";

export function getSquareServiceUrl(squareId?: string | null): string {
  if (squareId) {
    return `https://book.squareup.com/appointments/a1866bee-e25a-447d-a0ee-039f76a608d6/location/5V21SB1DSG5AG/services/${squareId}`;
  }
  return SQUARE_BOOKING_URL;
}
