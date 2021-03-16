const controller = require('../controllers/userController');
const mms = require('../config/mms');
const User = require('../models/user');
const {
  describe,
  beforeAll,
  afterEach,
  afterAll,
  test,
  expect,
  beforeEach,
} = require('@jest/globals');

describe('user model tests', () => {
  beforeAll(async () => {
    await mms.connect();
  });
  afterEach(async () => {
    await mms.clearDB();
  });
  afterAll(async () => {
    await mms.closeDB();
  });
  describe('CREATE', () => {
    test('add undefined user', async () => {
      try {
        await controller.create(user);
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
    test('without required fields', async () => {
      const user = new User({
        name: 'a',
      });
      try {
        await controller.create(user);
      } catch (e) {
        expect(e).toBeDefined();
      }
    });

    test('add user with wronge role', async () => {
      const user = {
        name: 'a',
        surname: 'b',
        email: 'c',
        password: 'd',
        role: 'e',
      };
      try {
        await controller.create(user);
      } catch (e) {
        expect(e).toBeDefined();
      }
    });

    test('success user create', async () => {
      const user = {
        name: 'a',
        surname: 'b',
        email: 'c',
        password: 'd',
        role: 'User',
      };
      await controller.create(user);
      const userDb = await User.find();
      expect(userDb).toHaveLength(1);
      expect(userDb[0]).toMatchObject(user);
    });
    test('success admin create', async () => {
      const user = {
        name: 'a',
        surname: 'b',
        email: 'c',
        password: 'd',
        role: 'Admin',
      };
      await controller.create(user);
      const userDb = await User.find();
      expect(userDb).toHaveLength(1);
      expect(userDb[0]).toMatchObject(user);
    });
  });

  describe('GET', () => {
    const CheckUser = (myUser, dbUser) => {
      expect(dbUser).toHaveProperty('name', myUser.name);
      expect(dbUser).toHaveProperty('surname', myUser.surname);
      expect(dbUser).toHaveProperty('email', myUser.email);
      expect(dbUser).toHaveProperty('password', myUser.password);
      expect(dbUser).toHaveProperty('role', myUser.role);
    };

    describe('geAll()', () => {
      test('getAll with empty db', async () => {
        const users = await controller.getAll();
        expect(users).toHaveLength(0);
      });

      test('getAll return created user', async () => {
        const user = await new User({
          name: 'a',
          surname: 'b',
          email: 'c',
          password: 'd',
          role: 'User',
        }).save();
        const users = await controller.getAll();
        expect(users).toHaveLength(1);
        CheckUser(user, users[0]);
      });

      test('getAll return some created user', async () => {
        const user1 = await new User({
          name: 'a',
          surname: 'b',
          email: 'c',
          password: 'd',
          role: 'User',
        }).save();
        const user2 = await new User({
          name: 'Oleh',
          surname: 'Fedorenko',
          email: 'o@i.ua',
          password: 'pass',
          role: 'Admin',
        }).save();
        const users = await controller.getAll();
        expect(users).toHaveLength(2);
        CheckUser(user1, users[0]);
        CheckUser(user2, users[1]);
      });
    });
    describe('getById()', () => {
      test('without id', async () => {
        try {
          await new User({
            name: 'a',
            surname: 'b',
            email: 'c',
            password: 'd',
            role: 'User',
          }).save();
          await controller.getById();
        } catch (e) {
          expect(e).toBeDefined();
        }
      });

      test('with wronge id', async () => {
        try {
          const user = await new User({
            name: 'a',
            surname: 'b',
            email: 'c',
            password: 'd',
            role: 'User',
          }).save();
          await controller.getById(user._id + 1);
        } catch (e) {
          expect(e).toBeDefined();
        }
      });

      test('Success get by Id', async () => {
        const user = await new User({
          name: 'a',
          surname: 'b',
          email: 'c',
          password: 'd',
          role: 'User',
        }).save();
        const findedUser = await controller.getById(user._id);
        CheckUser(user, findedUser);
      });
    });
    describe('getByEmail()', () => {
      test('without email', async () => {
        try {
          const user = await new User({
            name: 'a',
            surname: 'b',
            email: 'c',
            password: 'd',
            role: 'User',
          }).save();
          await controller.getByEmail();
        } catch (e) {
          expect(e).toBeDefined();
        }
      });

      test('with wronge email', async () => {
        try {
          await new User({
            name: 'a',
            surname: 'b',
            email: 'c',
            password: 'd',
            role: 'User',
          }).save();
          await controller.getByEmail('a');
        } catch (e) {
          expect(e).toBeDefined();
        }
      });

      test('Success get by Email', async () => {
        const user = await new User({
          name: 'a',
          surname: 'b',
          email: 'a@i.ua',
          password: 'd',
          role: 'User',
        }).save();
        const findedUser = await controller.getByEmail(user.email);
        CheckUser(user, findedUser);
      });
    });
  });
  describe('UPDATE', () => {
    test('update null user', async () => {
      try {
        await controller.update('1', { name: 'a' });
      } catch (e) {
        expect(e).toBeDefined();
      }
    });

    test('update with no new data', async () => {
      const user = await new User({
        name: 'Oleh',
        surname: 'Fedorenko',
        email: 'a@i.ua',
        password: 'qwerty',
        role: 'Admin',
      }).save();

      const user_copy = Object.assign({}, user);
      await controller.update(user._id, {});
      expect(user).toEqual(user_copy);
    });

    test('update with wronge role', async () => {
      const user = await new User({
        name: 'Oleh',
        surname: 'Fedorenko',
        email: 'a@i.ua',
        password: 'qwerty',
        role: 'Admin',
      }).save();
      try {
        await controller.update(user._id, {
          name: 'Bob',
          role: e,
        });
      } catch (e) {
        expect(e).toBeDefined();
        const userDb = await User.findById(user._id);
        expect(userDb.role).toEqual('Admin');
        expect(userDb.name).toEqual('Oleh');
      }
    });
    test('success update', async () => {
      const user = await new User({
        name: 'Oleh',
        surname: 'Fedorenko',
        email: 'a@i.ua',
        password: 'qwerty',
        role: 'Admin',
      }).save();

      const id = user._id;
      await controller.update(id, {
        name: 'Gleb',
        email: 'b@i.ua',
        role: 'User',
      });
      const user_update = await User.findById(id);
      expect(user_update._id).toEqual(id);
      expect(user_update.name).toEqual('Gleb');
      expect(user_update.surname).toEqual('Fedorenko');
      expect(user_update.email).toEqual('b@i.ua');
      expect(user_update.password).toEqual('qwerty');
      expect(user_update.role).toEqual('User');
    });
  });
  describe('DELETE', () => {
    test('delete null object', async () => {
      try {
        await new User({
          name: 'Oleh',
          surname: 'Fedorenko',
          email: 'a@i.ua',
          password: 'qwerty',
          role: 'Admin',
        }).save();
        await controller.delete();
      } catch (e) {
        expect(e).toBeDefined();
        const count = await User.count();
        expect(count).toEqual(1);
      }
    });

    test('delete with invalid id', async () => {
      try {
        const user = await new User({
          name: 'Oleh',
          surname: 'Fedorenko',
          email: 'a@i.ua',
          password: 'qwerty',
          role: 'Admin',
        }).save();
        await controller.delete(user._id + 1);
      } catch (e) {
        expect(e).toBeDefined();
        const count = await User.count();
        expect(count).toEqual(1);
      }
    });

    test('success delete', async () => {
      const user1 = await new User({
        name: 'Oleh',
        surname: 'Fedorenko',
        email: 'a@i.ua',
        password: 'qwerty',
        role: 'Admin',
      }).save();
      const user2 = await new User({
        name: 'Bob',
        surname: 'Fedorenko',
        email: 'b@i.ua',
        password: 'pass',
        role: 'User',
      }).save();
      await controller.delete(user1._id);
      const count = await User.count();
      expect(count).toEqual(1);
      try {
        await User.findById(user1._id);
      } catch (e) {
        expect(e).toBeDefined();
      }
    });

    test('can`t delete 1 object 2 times', async () => {
      const user = await new User({
        name: 'Oleh',
        surname: 'Fedorenko',
        email: 'a@i.ua',
        password: 'qwerty',
        role: 'Admin',
      }).save();
      await controller.delete(user._id);
      try {
        await controller.delete(user._id);
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });
});
