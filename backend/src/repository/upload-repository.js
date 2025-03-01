const Document = require('../models/Documents.js');

class uploadRepository {
    async storeFile (data) {
        try {
            console.log("Repository Layer Called", data);
            const document = await Document.create(data);
            console.log("File Saved in DB", document);
            return document;
        } catch (error) {
            console.log("something went wrong at repo layer",error);
            throw error;
        }
    }

    async getDocumentByUserId(userid){
        try {
            const documents = await Document.find({user_id:userid});
            return documents;
        } catch (error) {
            console.log("something went wrong at repo layer",error);
            throw error;
        }
    }
};

module.exports = uploadRepository;