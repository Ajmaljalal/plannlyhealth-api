import { Request, Response } from 'express';
import { Role } from '../lib/enums';
import { commentSchema } from '../models/comment';

import {
  createCommentService,
  getCommentByIdService,
  getCommentsByClaimIdService,
  getCommentsByAuthorService,
  updateCommentService,
  deleteCommentService,
} from '../services/comment';

export const createComment = async (req: Request, res: Response) => {
  const comment = req.body;

  // 1. check if the request body is empty
  if (!Object.keys(comment).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  // 2. add the created_date and updated_date to the comment
  comment.created_date = comment.created_date || Date();
  comment.modified_date = comment.modified_date || Date();

  // 3. validate the request body before creating a new comment using the commentSchema
  const { error } = commentSchema.validate(comment);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      code: 'INVALID_REQUEST_BODY'
    });
  }

  // 4. call the createCommentService to create a new comment
  const response: any = await createCommentService(comment);

  // 5. check if the response is an error
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
    // 6. if the response is not an error, send the comment
  } else {
    return res.status(201).json(response);
  }
}

export const getCommentById = async (req: Request, res: Response) => {
  // 1. get the comment id from the request params
  const commentId: string = req.params.id;

  // 2. call the getCommentByIdService to get the comment by id
  const response: any = await getCommentByIdService(commentId);
  // 3. check if the response is an error
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
    // 4. if the response is not an error, send the comment
  } else {
    return res.status(200).json(response);
  }
}

export const getCommentsByClaimId = async (req: Request, res: Response) => {
  // 1. get the claim id from the request params
  const claimId: string = req.params.id;

  // 2. call the getCommentsByClaimIdService to get the comments by claim id
  const response: any = await getCommentsByClaimIdService(claimId);
  // 3. check if the response is an error
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
    // 4. if the response is not an error, send the comments
  } else {
    return res.status(200).json(response);
  }
}

export const getCommentsByAuthor = async (req: Request, res: Response) => {
  // 1. get the author id from the request params
  const authorId: string = req.params.id;

  // 2. call the getCommentsByAuthorService to get the comments by author id
  const response: any = await getCommentsByAuthorService(authorId);
  // 3. check if the response is an error
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
    // 4. if the response is not an error, send the comments
  } else {
    return res.status(200).json(response);
  }
}

export const updateComment = async (req: Request, res: Response) => {
  const commentId: string = req.params.id;
  const comment = req.body;

  // 1. check if the request body is empty
  if (!Object.keys(comment).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  // 2. check if the comment exists in db
  const commentExists: any = await getCommentByIdService(commentId);
  if (!commentExists.Item) {
    return res.status(404).json({
      message: 'Comment not found',
      code: 'COMMENT_NOT_FOUND'
    });
  }

  // 3. check if the current user is the owner of the comment
  // @ts-ignore
  const authorizedUser: any = req.user.id;
  if (authorizedUser?.id !== commentExists.Item.owner && (authorizedUser?.role !== Role.Admin || authorizedUser?.role !== Role.Owner)) {
    return res.status(403).json({
      message: 'You are not authorized to perform this action',
      code: "UNAUTHORIZED"
    });
  }

  // 4. add the modified_date to the comment
  comment.modified_date = Date();

  // 5. validate the request body before updating the comment using the commentSchema
  const { error } = commentSchema.validate(comment);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      code: 'INVALID_REQUEST_BODY'
    });
  }

  // 6. call the updateCommentService to update the comment
  const response: any = await updateCommentService(commentId, comment);

  // 7. check if the response is an error
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  } else {
    // 8. if the response is not an error, send the comment
    return res.status(200).json(response);
  }

}

export const deleteComment = async (req: Request, res: Response) => {
  const commentId: string = req.params.id;

  // 1. check if the comment exists in db
  const commentExists: any = await getCommentByIdService(commentId);
  if (!commentExists.Item) {
    return res.status(404).json({
      message: 'Comment not found',
      code: 'COMMENT_NOT_FOUND'
    });
  }

  // 2. check if the current user is the owner of the comment
  // @ts-ignore
  const authorizedUser: any = req.user.id;
  if (authorizedUser?.id !== commentExists.Item.owner && (authorizedUser?.role !== Role.Admin || authorizedUser?.role !== Role.Owner)) {
    return res.status(403).json({
      message: 'You are not authorized to perform this action',
      code: "UNAUTHORIZED"
    });
  }

  // 3. call the deleteCommentService to delete the comment
  const response: any = await deleteCommentService(commentId);

  // 4. check if the response is an error
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  } else {
    // 5. if the response is not an error, send the comment
    return res.status(200).json(response);
  }
}
