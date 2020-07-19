import factory from 'factory-girl'
import faker from 'faker/locale/pt_BR'

import Segment from '@models/Segment'
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

factory.define('User2', User, {
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
  phone: faker.phone.phoneNumber(),
  role: UserRole.ADMIN,
  username: faker.internet.userName(),
  valid: true
})

factory.define('UserUpdate', User, {
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  phone: faker.phone.phoneNumber(),
  role: UserRole.ADMIN,
  username: faker.internet.userName(),
  valid: true
})

factory.define('Segment', Segment, {
  description: faker.name.title()
})

export default factory
