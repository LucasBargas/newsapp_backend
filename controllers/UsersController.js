import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User';
import News from '../models/News';
import EmailRegex from '../helpers/EmailRegex';
import CreateUserToken from '../helpers/CreateUserToken';
import GetToken from '../helpers/GetToken';
import GetUserByToken from '../helpers/GetUserByToken';

export default class UsersController {
  static async registerUser(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    if (!name) {
      res.status(422).json({ message: 'O nome é obrigatório.' });
      return;
    }

    if (!email) {
      res.status(422).json({ message: 'O email é obrigatório.' });
      return;
    }

    if (!EmailRegex.handleEmailRegex(email)) {
      res.status(422).json({ message: 'O email é inválido.' });
      return;
    }

    if (!password) {
      res.status(422).json({ message: 'A senha é obrigatória.' });
      return;
    }

    if (!confirmpassword) {
      res
        .status(422)
        .json({ message: 'A confirmação de senha é obrigatória.' });
      return;
    }

    if (password !== confirmpassword) {
      res.status(422).json({
        message: 'A senha e a confirmação de senha precisam ser iguais.',
      });
      return;
    }

    try {
      const userExists = await User.findOne({ email });

      if (userExists) {
        res.status(422).json({
          message: 'Usuário já cadastrado! Por favor, insira outro email.',
        });
        return;
      }

      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create a user
      const user = new User({
        name,
        email,
        password: passwordHash,
      });

      const newUser = await user.save();
      await CreateUserToken.handleCreateUserToken(newUser, req, res);
    } catch (error) {
      res.status(422).json({
        message: 'Houve um erro, por favor tente novamente mais tarde.',
      });
      return;
    }
  }

  static async loginUser(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(422).json({ message: 'O email é obrigatório.' });
      return;
    }

    if (!EmailRegex.handleEmailRegex(email)) {
      res.status(422).json({ message: 'O email é inválido.' });
      return;
    }

    if (!password) {
      res.status(422).json({ message: 'A senha é obrigatória.' });
      return;
    }

    try {
      const user = await User.findOne({ email });

      if (!user) {
        res.status(422).json({
          message: 'Não há usuário cadastrado com este email.',
        });
        return;
      }

      // Check if password match with db password
      const checkPassword = await bcrypt.compare(password, user.password);

      if (!checkPassword) {
        res.status(422).json({
          message: 'A senha inserida é inválida.',
        });
        return;
      }

      await CreateUserToken.handleCreateUserToken(user, req, res);
    } catch (error) {
      res.status(422).json({
        message: 'Houve um erro, por favor tente novamente mais tarde.',
      });
      return;
    }
  }

  static async getAuthUser(req, res) {
    try {
      const token = GetToken.handleGetToken(req);
      const user = await GetUserByToken.handleGetUserByToken(token, req, res);
      user.password = undefined;

      res.status(200).json(user);
    } catch (error) {
      res.status(422).json({
        message: 'Houve um erro, por favor tente novamente mais tarde.',
      });
      return;
    }
  }

  static async editUser(req, res) {
    try {
      const token = GetToken.handleGetToken(req);
      const user = await GetUserByToken.handleGetUserByToken(token, req, res);

      const { name, email, bio, password, confirmpassword } = req.body;

      if (!name) {
        res.status(422).json({ message: 'O nome é obrigatório.' });
        return;
      }

      user.name = name;

      const userExists = await User.findOne({ email });

      if (email && email !== user.email && userExists) {
        res.status(422).json({
          message: 'Email já cadastrado.',
        });
        return;
      }

      if (!email) {
        res.status(422).json({ message: 'O email é obrigatório.' });
        return;
      }

      if (!EmailRegex.handleEmailRegex(email)) {
        res.status(422).json({ message: 'O email é inválido.' });
        return;
      }

      user.email = email;

      if (bio) user.bio = bio;

      if (password && !confirmpassword) {
        res.status(422).json({
          message: 'A confirmação de senha é obrigatória.',
        });
        return;
      }

      if (confirmpassword && !password) {
        res.status(422).json({
          message: 'A senha é obrigatória.',
        });
        return;
      }

      if (password && confirmpassword && password !== confirmpassword) {
        res.status(422).json({
          message: 'A senha e a confirmação de senha precisam ser iguais.',
        });
        return;
      }

      if (password && confirmpassword && password === confirmpassword) {
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);
        user.password = passwordHash;
      }

      // returns update data
      await user.save();
      res.status(200).json({ message: 'Usuário atualizado com sucesso.' });
    } catch (err) {
      res.status(422).json({
        message: 'Houve um erro, por favor tente novamente mais tarde.',
      });
      return;
    }
  }

  static async deleteUser(req, res) {
    try {
      const token = GetToken.handleGetToken(req);
      const user = await GetUserByToken.handleGetUserByToken(token, req, res);

      await User.findByIdAndDelete(mongoose.Types.ObjectId(user._id));
      await News.deleteMany({ userId: user._id });
      res.status(200).json({ message: 'Usuário deletado :(' });
    } catch (err) {
      res.status(422).json({
        message: 'Houve um erro, por favor tente novamente mais tarde.',
      });
      return;
    }
  }
}
