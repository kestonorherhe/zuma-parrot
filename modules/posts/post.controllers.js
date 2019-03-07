const mongoose = require('mongoose')
import HTTPStatus from 'http-status';
const grid = require("gridfs-stream");

import Post from './post.model';
import Admin from '../admins/admin.model'; 

//  this is a protected route
export async function createPost(req, res) {
  try {
    const post = await Post.createPost(req.body, req.user._id);
    return res.status(HTTPStatus.CREATED).json(post);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export async function appendImagePath(req, res) {
  let files = req.files[0].filename
  try {
    const append = await Post.findByIdAndUpdate({ _id: req.params.id }, { $set: { imageUrl: files } })
    const appended = await append
    return res.status(HTTPStatus.OK).json(appended)
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e)
  }
}

export async function getPostById(req, res) {
  try {
    const promise = await Post.findById(req.params.id)
    const post = await promise

    return res.status(HTTPStatus.OK).json(post)
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
}

// this is a protected route
// export async function getPostById(req, res) { 
//   console.log(req)
//   try {
//     const promise = await Promise.all([
//       Admin.findById(req.user._id),
//       Post.findById(req.params.id).populate('admin')
//     ]);

//     // const favorite = promise[0]._favorites.isPostIsFavorite(req.params.id);
//     // console.log(promise[0]);
//     const post = promise[1];

//     return res.status(HTTPStatus.OK).json({
//       ...post.toJSON(),
//       // favorite
//     });
//   } catch (e) {
//     return res.status(HTTPStatus.BAD_REQUEST).json(e);
//   }
// } 

export async function getPostsList(req, res) {
  try {
    const promise = await Post.find({})
    const posts = await promise

    return res.status(HTTPStatus.OK).json(posts)
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
}

// this is a protected route
// export async function getPostsList(req, res) {
//   console.log(req.body);
//   const limit = parseInt(req.query.limit, 0);
//   const skip = parseInt(req.query.skip, 0);
//   try {
//     const promise = await Promise.all([
//       User.findById(req.user._id),
//       Post.list({ limit, skip })
//     ]);

//     const posts = promise[1].reduce((arr, post) => {
//       const favorite = promise[0]._favorites.isPostIsFavorite(post._id);

//       arr.push({
//         ...post.toJSON(),
//         favorite
//       });

//       return arr;
//     }, []);

//     return res.status(HTTPStatus.OK).json(posts);
//   } catch (e) {
//     return res.status(HTTPStatus.BAD_REQUEST).json(e);
//   }
// }

// get images by :name
export function getImageByName(req, res) {
  let filename = req.params.name
  mongoose.connect("mongodb://localhost:27017/zuma-parrot", { useNewUrlParser: true })
  var db = mongoose.connection

  db.once('open', function (err) {

    if (err) return handleError(err);
    grid.mongo = mongoose.mongo;
    const gfs = grid(db.db)

    db.collection('fs.files'); //set collection name to lookup into

    /** First check if file exists */
    gfs.files.find({ filename: filename }).toArray(function (err, file) {
      if (!file || file.length === 0) {
        return res.status(404).json({
          responseCode: 1,
          responseMessage: "image not found"
        });
      }
      // create read stream
      var readstream = gfs.createReadStream({
        filename: file[0].filename
      })
      return readstream.pipe(res); 
    });
  })

}

// this is a protected route
export async function updatePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.user.equals(req.user._id)) {
      return res.sendStatus(HTTPStatus.UNAUTHORIZED);
    }

    Object.keys(req.body).forEach(key => {
      post[key] = req.body[key];
    });

    return res.status(HTTPStatus.OK).json(await post.save());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

// this is a protected route
// this route is used to delete post created by the auth user
// export async function deletePost(req, res) {
//   try {
//     const post = await Post.findById(req.params.id);

//     if (!post.user.equals(req.user._id)) {
//       return res.sendStatus(HTTPStatus.UNAUTHORIZED);
//     }

//     await post.remove();
//     return res.sendStatus(HTTPStatus.OK);
//   } catch (e) {
//     return res.status(HTTPStatus.BAD_REQUEST).json(e);
//   }
// }

export async function deletePost(req, res) {
  // get project id from request params
  let id = req.params.id

  try {
    const remove = await Post.findByIdAndRemove(id)
    const response = await remove

    return res.status(HTTPStatus.OK).json(response)
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e)
  }
}

export async function favoritePost(req, res) {
  try {
    const user = await User.findById(req.user._id);
    await user._favorites.posts(req.params.id);
    return res.sendStatus(HTTPStatus.OK);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}
