const uploadRepository = require('../repository/upload-repository.js');

const uploadRepo = new uploadRepository();

saveFile = async (fileData) => {
    try {
        console.log("Service Layer Called", fileData);
        const response = await uploadRepo.storeFile(fileData);
        return response;
    } catch (error) {
        console.log("Service leyer error",error);
        throw new Error('Error saving file to database.');
    }
};

// exports.getAllFiles = async () => {
//     try {
//         return await uploadRepo.fetchFiles();
//     } catch (error) {
//         throw new Error('Error retrieving files.');
//     }
// };

module.exports = {
    saveFile
}