export const Patterns = {
  EVENTS: {
    FIND_ALL: 'events.findAll',
    FIND_ONE: 'events.findOne',
    CREATE: 'events.create',
    UPDATE: 'events.update',
  },
  CATEGORIES: {
    FIND_ALL: 'categories.findAll',
    FIND_ONE: 'categories.findOne',
    CREATE: 'categories.create',
    UPDATE: 'categories.update',
    REMOVE: 'categories.remove',
  },
  BOOKING: {
    FIND_ONE: 'booking.findOne',
    BOOK_SEATS: 'booking.bookSeats',
    CANCEL_BOOKING: 'booking.cancelBooking',
    FIND_ALL_BY_USER: 'booking.findAllByUser',
    FIND_ALL_BY_EVENT: 'booking.findAllByEvent',
    CANCEL_MANY_BY_EVENT: 'booking.cancelManyByEvent',
  },
  TICKET_TIERS: {
    CREATE: 'ticketTiers.create',
    FIND_ALL: 'ticketTiers.findAll',
    FIND_ONE: 'ticketTiers.findOne',
    UPDATE: 'ticketTiers.update',
    REMOVE: 'ticketTiers.remove',
  },
  USERS: {
    FIND_ONE: 'users.findOne',
    FIND_ALL: 'users.findAll',
    FIND_EMAILS_BY_IDS: 'users.findEmailsByIds',
    UPDATE: 'users.update',
  },
  AUTH: {
    SIGN_IN: 'auth.signIn',
    SIGN_UP: 'auth.signUp',
    CHANGE_PASSWORD: 'auth.changePassword',
    CONFIRM_EMAIL: 'auth.confirmEmail',
    RESEND_CONFIRMATION: 'auth.resendConfirmation',
    FORGOT_PASSWORD: 'auth.forgotPassword',
    RESET_PASSWORD: 'auth.resetPassword',
  },
  NOTIFICATIONS: {
    SEND_EMAIL: 'notifications.sendEmail',
  },
};
