import { Router } from 'express';
import validate from 'express-validation';
import multer from 'multer'
import GridFsStorage from 'multer-gridfs-storage'

import * as postController from './post.controllers';
import { authJwt } from '../../services/auth.services';
import postValidation from './post.validations';

// use this for grid-fs storage
const storage = new GridFsStorage({
  url: 'mongodb://localhost:27017/zuma-parrot',
  file: (req, file) => {
    if (file.mimetype === 'image/jpeg') {
      return {
        bucketName: 'fs',
        filename: file.originalname
      };
    } else {
      return null;
    }
  }
});

const upload = multer({ storage: storage })

const routes = new Router();

// this is a protected route
routes.post(
  '/',
  authJwt,
  validate(postValidation.createPost),
  postController.createPost,
);

routes.put(
  '/appendpath/:id',
  upload.array('images', 3),
  postController.appendImagePath
)

routes.get('/:id', postController.getPostById);

routes.get(
  '/image/:name',
  postController.getImageByName
)

// this is a protected route
// routes.get('/:id', authJwt, postController.getPostById);

routes.get('/', postController.getPostsList);

routes.get(
  '/category/tag',
  postController.getPostsByCategory
);

// this is a protected route
// routes.get('/', authJwt, postController.getPostsList);

routes.patch(
  '/:id',
  authJwt,
  validate(postValidation.updatePost),
  postController.updatePost,
);
routes.delete('/:id', postController.deletePost);

// Favorites
routes.post('/:id/favorite', authJwt, postController.favoritePost);

export default routes;
