import mongoose from 'mongoose';
import GetToken from '../helpers/GetToken';
import GetUserByToken from '../helpers/GetUserByToken';
import SearchForNews from '../helpers/SearchForNews';
import News from '../models/News';

export default class NewsController {
  static async newsCreate(req, res) {
    const { title, body, category, author } = req.body;

    if (!title) {
      res.status(422).json({ message: 'A notícia precisa ter um título.' });
      return;
    }

    if (!body) {
      res.status(422).json({ message: 'A notícia precisa ter um conteúdo.' });
      return;
    }

    if (!category) {
      res.status(422).json({ message: 'A notícia precisa ter uma categoria.' });
      return;
    }

    if (!author) {
      res.status(422).json({ message: 'A notícia precisa ter um autor.' });
      return;
    }

    try {
      const token = GetToken.handleGetToken(req);
      const user = await GetUserByToken.handleGetUserByToken(token, req, res);

      if (!user) {
        res
          .status(422)
          .json({ message: 'Houve um erro, tente novamente mais tarde!' });

        return;
      }

      const news = {
        title,
        body,
        category,
        author,
        userId: user._id,
        userName: user.name,
      };

      await News.create(news);
      res.status(200).json({ message: 'Notícia criada com sucesso' });
      return;
    } catch (error) {
      res
        .status(422)
        .json({ message: 'Houve um erro, tente novamente mais tarde!' });

      return;
    }
  }

  static async allNews(req, res) {
    try {
      const news = await News.find().sort('-createdAt');
      res.status(200).json(news);
      return;
    } catch (error) {
      res.status(404).json({ message: 'Houve um erro.' });
      return;
    }
  }

  static async newsById(req, res) {
    const { id } = req.params;

    try {
      const news = await News.findById(mongoose.Types.ObjectId(id));

      if (!news) {
        res
          .status(404)
          .json({ message: 'Notícia não encontrada ou ID inválido.' });
        return;
      }

      res.status(200).json(news);
      return;
    } catch (error) {
      res
        .status(422)
        .json({ message: 'Houve um erro, tente novamente mais tarde.' });
      return;
    }
  }

  static async newsByUser(req, res) {
    try {
      const token = GetToken.handleGetToken(req);
      const user = await GetUserByToken.handleGetUserByToken(token, req, res);
      const news = await News.find({ userId: user._id }).sort('-createdAt');

      if (!news) {
        res.status(404).json({
          message: 'Notícia não encontrada ou ID inválido.',
        });
        return;
      }

      res.status(200).json(news);
      return;
    } catch (error) {
      res
        .status(422)
        .json({ message: 'Houve um erro, tente novamente mais tarde.' });
      return;
    }
  }

  static async newsLike(req, res) {
    const { id } = req.params;

    try {
      const news = SearchForNews.handleSearchByNews(id);

      if (news.length === 0) {
        res
          .status(404)
          .json({ message: `Nenhuma notícia encontrada com: ${id}` });
        return;
      }

      res.status(200).json(news);
      return;
    } catch (error) {
      res
        .status(422)
        .json({ message: 'Houve um erro, tente novamente mais tarde.' });
      return;
    }
  }

  static async newsSearch(req, res) {
    const { q } = req.query;

    try {
      const news = SearchForNews.handleSearchByNews(q);

      if (news.length === 0) {
        res
          .status(404)
          .json({ message: `Nenhuma notícia encontrada com: ${q}` });
        return;
      }

      res.status(200).json(news);
      return;
    } catch (error) {
      res
        .status(422)
        .json({ message: 'Houve um erro, tente novamente mais tarde.' });
      return;
    }
  }

  static async newsUpdateById(req, res) {
    const { id } = req.params;
    const { title, body, category, author } = req.body;

    try {
      const token = GetToken.handleGetToken(req);
      const user = await GetUserByToken.handleGetUserByToken(token, req, res);

      const news = await News.findById(mongoose.Types.ObjectId(id));

      if (!user._id.equals(news.userId)) {
        res
          .status(422)
          .json({ message: 'Houve um erro, tente novamente mais tarde.' });
        return;
      }

      if (!news) {
        res
          .status(404)
          .json({ message: 'Notícia não encontrada ou ID inválido.' });
        return;
      }

      if (!title) {
        res.status(422).json({ message: 'A notícia precisa ter um título.' });
        return;
      }

      news.title = title;

      if (!body) {
        res.status(422).json({ message: 'A notícia precisa ter um conteúdo.' });
        return;
      }

      news.body = body;

      if (!category) {
        res
          .status(422)
          .json({ message: 'A notícia precisa ter uma categoria.' });
        return;
      }

      news.category = category;

      if (!author) {
        res.status(422).json({ message: 'A notícia precisa ter um autor.' });
        return;
      }

      news.author = author;

      await news.save();
      res.status(200).json({ message: 'Notícia atualizada com sucesso.' });
      return;
    } catch (error) {
      res
        .status(422)
        .json({ message: 'Houve um erro, tente novamente mais tarde.' });
      return;
    }
  }

  static async newsDeleteById(req, res) {
    const { id } = req.params;

    try {
      const token = GetToken.handleGetToken(req);
      const user = await GetUserByToken.handleGetUserByToken(token, req, res);

      const news = await News.findById(mongoose.Types.ObjectId(id));

      if (!user._id.equals(news.userId)) {
        res
          .status(422)
          .json({ message: 'Houve um erro, tente novamente mais tarde.' });
        return;
      }

      if (!news) {
        res
          .status(404)
          .json({ message: 'Notícia não encontrada ou ID inválido.' });
        return;
      }

      await News.findByIdAndDelete(id);
      res.status(200).json({ message: 'Notícia deletada com sucesso.' });
      return;
    } catch (error) {
      res
        .status(422)
        .json({ message: 'Houve um erro, tente novamente mais tarde.' });
      return;
    }
  }
}
