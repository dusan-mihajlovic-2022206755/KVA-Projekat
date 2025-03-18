import { OrderModel } from "../models/order.model"
import { UserModel } from "../models/user.model"

export class UserService {

    static retrieveUsers(): UserModel[] {
        if (!localStorage.getItem('users')) {
            const arr: UserModel[] = [
                {
                    email: 'test@test.com',
                    firstName: 'Dušan',
                    lastName: 'Mihajlović',
                    phone: '+3816123456789',
                    address: 'Majke Jevrosime',
                    favouriteGenre: 'Komedija',
                    password: 'test',
                    orders: []
                }
            ]

            localStorage.setItem('users', JSON.stringify(arr))
        }

        return JSON.parse(localStorage.getItem('users')!)
    }

    static createUser(model: UserModel) {
        const users = this.retrieveUsers()

        for (let u of users) {
            if (u.email === model.email)
                return false
        }

        users.push(model)
        localStorage.setItem('users', JSON.stringify(users))
        return true
    }

    static updateUser(model: UserModel) {
      const users = this.retrieveUsers()
      for (let u of users) {
        if (u.email === model.email) {
          u.firstName = model.firstName
          u.lastName = model.lastName
          u.address = model.address
          u.phone = model.phone
          u.favouriteGenre = model.favouriteGenre
        }
      }

      localStorage.setItem('users', JSON.stringify(users))
    }
    static login(email: string, password: string): boolean {
        for (let user of this.retrieveUsers()) {
            if (user.email === email && user.password === password) {
                localStorage.setItem('active', user.email)
                return true
            }
        }

        return false
    }

    static getActiveUser(): UserModel | null {
        if (!localStorage.getItem('active'))
            return null

        for (let user of this.retrieveUsers()) {
            if (user.email == localStorage.getItem('active')) {
                return user
            }
        }

        return null
    }

    static createOrder(order: OrderModel) {
        const arr = this.retrieveUsers()
        for (let user of arr) {
            if (user.email == localStorage.getItem('active')) {
                user.orders.push(order)
                localStorage.setItem('users', JSON.stringify(arr))
                return true
            }
        }

        return false
    }

    static changeOrderStatus(state: 'slobodno' | 'rezervisano' | 'gledano' | 'otkazano', id: number) {
        const active = this.getActiveUser()
        if (active) {
            const arr = this.retrieveUsers()
            for (let user of arr) {
                if (user.email == active.email) {
                    for (let order of user.orders) {
                        if (order.id == id) {
                            order.status = state
                        }
                    }
                    localStorage.setItem('users', JSON.stringify(arr))
                    return true
                }
            }
        }
        return false
    }

  static changeRating(rating: number, id: number) {
    const active = this.getActiveUser();
    if (active) {
      const arr = this.retrieveUsers();
      for (let user of arr) {
        if (user.email == active.email) {
          for (let order of user.orders) {
            if (order.id == id && order.status === 'gledano') {
              order.rating = rating;
            }
          }
          localStorage.setItem('users', JSON.stringify(arr));
          return true;
        }
      }
    }
    return false;
  }

    static changePassword(newPassword: string): boolean {

        const arr = this.retrieveUsers()
        for (let user of arr) {
            if (user.email == localStorage.getItem('active')) {
                user.password = newPassword
                localStorage.setItem('users', JSON.stringify(arr))
                return true
            }
        }

        return false
    }
}
