export const Patterns = {
  EVENTS: {
    FIND_ALL: 'events.findAll',
    FIND_ONE: 'events.findOne',
    CREATE: 'events.create',
    UPDATE: 'events.update',
    REMOVE: 'events.remove',
  },
  BOOKING: {
    BOOK_SEATS: 'booking.bookSeats',
    CANCEL_BOOKING: 'booking.cancelBooking',
    FIND_ALL_BY_USER: 'booking.findAllByUser',
    DELETE_MANY_BY_EVENT: 'booking.deleteManyByEvent',
  },
  USERS: {
    SIGN_UP: 'users.signUp',
    SIGN_IN: 'users.signIn',
    VALIDATE_TOKEN: 'users.validateToken',
    FIND_ONE: 'users.findOne',
    FIND_EMAILS_BY_IDS: 'users.findEmailsByIds',
  },
  NOTIFICATIONS: {
    SEND_EMAIL: 'notifications.sendEmail',
  },
};
