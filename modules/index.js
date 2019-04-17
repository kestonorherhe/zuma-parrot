import adminRoutes from './admins/admin.routes'
import categoryRoutes from './categories/category.routes'
import postRoutes from './posts/post.routes';
import commentRoutes from './comments/comment.routes';
import replyRoutes from './reply/reply.routes';
import userRoutes from './users/user.routes';

export default app => {
  app.use('/api/v1/admins', adminRoutes);
  app.use('/api/v1/categories', categoryRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/posts', postRoutes);
  app.use('/api/v1/comments', commentRoutes);
  app.use('/api/v1/replies', replyRoutes);
};
