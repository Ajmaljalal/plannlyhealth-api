import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { Role } from '../lib/enums';
import { CreateCommentSchema, UpdateCommentSchema } from '../models/comment';

import {
  createCommentService,
  getCommentByIdService,
  getCommentsByClaimIdService,
  getCommentsByAuthorService,
  updateCommentService,
  deleteCommentService,
  getAllCommentsService,
} from '../services/comments';

export const createComment = async (req: Request, res: Response) => {
  const comment = req.body;

  // 1. check if the request body is empty
  if (!Object.keys(comment).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  // 2. add the required modifications to the comment
  comment.id = uuid(); // dynamodb does not have an auto generated id
  comment.created_date = comment.created_date || Date();
  comment.modified_date = comment.modified_date || Date();

  // 3. validate the request body before creating a new comment using the commentSchema
  const { error } = CreateCommentSchema.validate(comment);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      code: 'INVALID_REQUEST_BODY'
    });
  }

  try {
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
      return res.status(201).json(response.Item);
    }
  } catch (err: any) {
    // 7. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const getCommentById = async (req: Request, res: Response) => {
  // 1. get the comment id from the request params
  const commentId: string = req.params.id;

  // 2. check if their is no comment id
  if (!commentId) {
    return res.status(400).json({
      message: 'Comment id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }


  try {
    // 3. call the getCommentByIdService to get the comment by id
    const response: any = await getCommentByIdService(commentId);
    // 4. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
      // 5. if the response is not an error, send the comment
    } else {
      return res.status(200).json(response.Item);
    }
  } catch (err: any) {
    // 6. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const getAllComments = async (req: Request, res: Response) => {
  try {
    // 1. call the getAllCommentsService to get all the comments
    const response: any = await getAllCommentsService();
    // 2. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
      // 3. if the response is not an error, send the comments
    } else {
      return res.status(200).json(response.Items);
    }
  } catch (err: any) {
    // 4. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const getCommentsByClaimId = async (req: Request, res: Response) => {
  // 1. get the claim id from the request params
  const claimId: string = req.params.id;

  // 2. check if their is no claim id
  if (!claimId) {
    return res.status(400).json({
      message: 'Claim id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 3. call the getCommentsByClaimIdService to get the comments by claim id
    const response: any = await getCommentsByClaimIdService(claimId);
    // 4. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
      // 5. if the response is not an error, send the comments
    } else {
      return res.status(200).json(response.Items);
    }
  } catch (err: any) {
    // 6. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const getCommentsByAuthor = async (req: Request, res: Response) => {
  // 1. get the author id from the request params
  const authorId: string = req.params.id;

  // 2. check if their is no author id
  if (!authorId) {
    return res.status(400).json({
      message: 'Author id (user id) in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 3. call the getCommentsByAuthorService to get the comments by author id
    const response: any = await getCommentsByAuthorService(authorId);
    // 4. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
      // 5. if the response is not an error, send the comments
    } else {
      return res.status(200).json(response.Items);
    }
  } catch (err: any) {
    // 6. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const updateComment = async (req: Request, res: Response) => {
  const commentId: string = req.params.id;
  const comment = req.body;

  // 1. check if comment id is empty
  if (!commentId) {
    return res.status(400).json({
      message: 'Comment id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  // 2. check if the request body is empty
  if (!Object.keys(comment).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  try {
    // 3. check if the comment exists in db
    const commentExists: any = await getCommentByIdService(commentId);
    if (!commentExists.Item) {
      return res.status(404).json({
        message: 'Comment not found',
        code: 'COMMENT_NOT_FOUND'
      });
    }

    // 4. check if the current user is the owner of the comment
    // @ts-ignore
    // const authorizedUser: any = req?.user;
    // if (authorizedUser?.id !== commentExists.Item.owner && (authorizedUser?.role !== Role.Admin || authorizedUser?.role !== Role.Owner)) {
    //   return res.status(403).json({
    //     message: 'You are not authorized to perform this action',
    //     code: "UNAUTHORIZED"
    //   });
    // }

    // 4. add the required modifications to the comment
    delete comment.id; // this is because the id is not allowed to be updated
    delete commentExists.Item?.id; // this is because the id is not allowed to be updated
    comment.modified_date = comment.modified_date || Date();
    const commentToUpdate = { ...commentExists.Item, ...comment };
    comment.modified_date = Date();

    // 5. validate the request body before updating the comment using the UpdateCommentSchema
    const { error } = UpdateCommentSchema.validate(commentToUpdate);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        code: 'INVALID_REQUEST_BODY'
      });
    }

    // 6. call the updateCommentService to update the comment
    const response: any = await updateCommentService(commentId, commentToUpdate);

    // 7. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 8. if the response is not an error, send the comment
      return res.status(200).json(response.Attributes);
    }
  } catch (err: any) {
    // 9. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }

}

export const deleteComment = async (req: Request, res: Response) => {
  const commentId: string = req.params.id;

  // 1. check if comment id is empty
  if (!commentId) {
    return res.status(400).json({
      message: 'Comment id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
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
    // const authorizedUser: any = req.user;
    // if (authorizedUser?.id !== commentExists.Item.owner && (authorizedUser?.role !== Role.Admin || authorizedUser?.role !== Role.Owner)) {
    //   return res.status(403).json({
    //     message: 'You are not authorized to perform this action',
    //     code: "UNAUTHORIZED"
    //   });
    // }

    // 4. call the deleteCommentService to delete the comment
    const response: any = await deleteCommentService(commentId);

    // 5. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 6. if the response is not an error, send the comment
      return res.status(200).json(response);
    }
  } catch (err: any) {
    // 7. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}
