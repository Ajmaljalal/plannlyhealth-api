import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { CreateDocumentSchema, UpdateDocumentSchema } from '../models/document';
import { createDocumentService, getAllDocumentsService, getDocumentByIdService, getDocumentsByCompanyIdService, getDocumentsByOwnerIdService, updateDocumentService, deleteDocumentService } from '../services/documents';

export const createDocument = async (req: Request, res: Response) => {
  const document = req.body;

  // 1. check if the request body is empty
  if (!Object.keys(document).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  try {
    // 2. add the required modifications to the document
    document.id = uuid();
    document.created_date = Date();
    document.modified_date = Date();

    // 3. validate the request body before creating the document using the CreateDocumentSchema
    const { error } = CreateDocumentSchema.validate(document);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        code: 'INVALID_REQUEST_BODY'
      });
    }

    // 4. call the createDocumentService to create the document
    const response: any = await createDocumentService(document);

    // 5. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 6. if the response is not an error, send the document
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

export const getDocumentById = async (req: Request, res: Response) => {
  const documentId: string = req.params.id;

  // 1. check if document id is empty
  if (!documentId) {
    return res.status(400).json({
      message: 'Document id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 2. call the getDocumentByIdService to get the document by id
    const response: any = await getDocumentByIdService(documentId);

    // 3. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
      // 4. if the response is not an error, send the document
    } else {
      return res.status(200).json(response.Item);
    }
  } catch (err: any) {
    // 5. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const getDocumentsByCompanyId = async (req: Request, res: Response) => {
  const companyId: string = req.params.id;

  // 1. check if company id is empty
  if (!companyId) {
    return res.status(400).json({
      message: 'Company id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 2. call the getDocumentByCompanyIdService to get the document by company id
    const response: any = await getDocumentsByCompanyIdService(companyId);

    // 3. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
      // 4. if the response is not an error, send the document
    } else {
      return res.status(200).json(response.Items);
    }
  } catch (err: any) {
    // 5. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const getDocumentsByOwnerId = async (req: Request, res: Response) => {
  const ownerId: string = req.params.id;

  // 1. check if owner id is empty
  if (!ownerId) {
    return res.status(400).json({
      message: 'Owner id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 2. call the getDocumentsByOwnerIdService to get the documents by owner id
    const response: any = await getDocumentsByOwnerIdService(ownerId);

    // 3. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
      // 4. if the response is not an error, send the documents
    } else {
      return res.status(200).json(response.Items);
    }
  } catch (err: any) {
    // 5. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const getAllDocuments = async (req: Request, res: Response) => {
  try {
    // 1. call the getAllDocumentsService to get all the documents
    const response: any = await getAllDocumentsService();

    // 2. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
      // 3. if the response is not an error, send the documents
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

export const updateDocument = async (req: Request, res: Response) => {
  const documentId: string = req.params.id;
  const document = req.body;

  // 1. check if document id is empty
  if (!documentId) {
    return res.status(400).json({
      message: 'Document id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  // 2. check if the request body is empty
  if (!Object.keys(document).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  try {
    // 3. check if the document exists in db
    const documentExists: any = await getDocumentByIdService(documentId);
    if (!documentExists.Item) {
      return res.status(404).json({
        message: 'Document not found',
        code: 'DOCUMENT_NOT_FOUND'
      });
    }

    // 4. check if the current user is the owner of the document
    // @ts-ignore
    // const authorizedUser: any = req?.user;
    // if (authorizedUser?.id !== documentExists.Item.owner && (authorizedUser?.role !== Role.Admin || authorizedUser?.role !== Role.Owner)) {
    //   return res.status(403).json({
    //     message: 'You are not authorized to perform this action',
    //     code: "UNAUTHORIZED"
    //   });
    // }

    // 4. add the required modifications to the document
    delete document.id; // this is because the id is not allowed to be updated
    delete documentExists.Item?.id; // this is because the id is not allowed to be updated
    document.modified_date = document.modified_date || Date();
    const documentToUpdate = { ...documentExists.Item, ...document };

    // 5. validate the request body before updating the document using the UpdateDocumentSchema
    const { error } = UpdateDocumentSchema.validate(documentToUpdate);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        code: 'INVALID_REQUEST_BODY'
      });
    }

    // 6. call the updateDocumentService to update the document
    const response: any = await updateDocumentService(documentId, documentToUpdate);

    // 7. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    }
    // 8. if the response is not an error, send the document
    return res.status(200).json(response.Attributes);
  } catch (err: any) {
    // 9. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const deleteDocument = async (req: Request, res: Response) => {
  const documentId: string = req.params.id;

  // 1. check if document id is empty
  if (!documentId) {
    return res.status(400).json({
      message: 'Document id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 2. check if the document exists in db
    const documentExists: any = await getDocumentByIdService(documentId);
    if (!documentExists.Item) {
      return res.status(404).json({
        message: 'Document not found',
        code: 'DOCUMENT_NOT_FOUND'
      });
    }

    // 3. check if the current user is the owner of the document
    // @ts-ignore
    // const authorizedUser: any = req.user;
    // if (authorizedUser?.id !== documentExists.Item.owner && (authorizedUser?.role !== Role.Admin || authorizedUser?.role !== Role.Owner)) {
    //   return res.status(403).json({
    //     message: 'You are not authorized to perform this action',
    //     code: "UNAUTHORIZED"
    //   });
    // }

    // 4. call the deleteDocumentService to delete the document
    const response: any = await deleteDocumentService(documentId);

    // 5. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 6. if the response is not an error, send the document
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