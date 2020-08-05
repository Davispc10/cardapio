import factory from 'factory-girl'
import faker from 'faker/locale/pt_BR'

import Address from '@models/Address'
import Business from '@models/Business'
import Category from '@models/Category'
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

factory.define('Address', Address, {
  street: faker.address.streetAddress(),
  city: faker.address.city(),
  state: faker.address.state(),
  postalCode: faker.address.zipCode(),
  locality: faker.address.streetName(),
  number: faker.address.countryCode()
})

factory.define('Business', Business, {
  name: faker.company.companyName(),
  description: faker.company.companySuffix(),
  payment: faker.commerce.department(),
  phone: faker.phone.phoneNumber(),
  whatsapp: faker.phone.phoneNumber(),
  street: faker.address.streetAddress(),
  city: faker.address.city(),
  state: faker.address.state(),
  postalCode: faker.address.zipCode(),
  locality: faker.address.streetName(),
  number: faker.address.countryCode()
})

factory.define('Category', Category, {
  description: faker.commerce.department()
})

export default factory
