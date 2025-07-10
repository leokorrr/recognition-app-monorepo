export const ERR_BAD_PAYLOAD = 'Error: Bad payload'

export const notExists = (item: string) => `Error: ${item} doesn\'t exists`

export const generalActionError = (action: string, item: string) =>
  `Error: ${action} ${item}`

export const ERR_GENERAL = 'Error: Something went wrong'

export const ERR_USER_ALREADY_EXISTS = 'Error: User with this email already exists'

export const ERR_NOT_ACCEPTED_TERMS_AND_CONDITIONS = 'Error: Something went wrong'

export const ERR_ACCESS_DENIED = 'Error: Access denied'

export const alreadyExists = (item: string) => `Error: ${item} already exists`

export const ERR_ACTION_NOT_ALLOWED = 'Error: This action is not allowed'

export const ERR_UNAUTHORIZED = 'Error: Unauthorized'

export const ERR_PASSWORD_FORMAT = 'Password must be at least 8 characters long, including at least one uppercase letter, one lowercase letter, and one symbol.'
