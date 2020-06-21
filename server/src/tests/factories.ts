import factory from 'factory-girl'
import faker from 'faker/locale/pt_BR'

// import User, { UserRole } from '@models/User'
import User, { UserRole } from '@models/User'

factory.define('User', User, {
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
  phone: faker.phone.phoneNumber(),
  role: UserRole.ADMIN,
  username: faker.internet.userName(),
  valid: true
})

export default factory
