const { existsSync, unlinkSync, rmSync, mkdirSync } = require("node:fs");

//@dec this function used to delete image when update data and delete
const deleteImage = (req, document) => {
  {
    const imagePath = document
      ? `${req.body.directorUrl}/${document.image.split("/")[4]}`
      : req.body.image;

    //check image in body
    if (imagePath) {
      //generate path image from document or body when found error in document not found
      // //check path photo find in folder or no
      if (existsSync(imagePath)) {
        // if found delete photo
        unlinkSync(imagePath);
      }
    }
  }
};

const deleteImagesInFolder = (folderName) => {
  {
    const directorFolderPath = `uploads/${folderName}`;
    //check image in body

    //generate path image from document or body when found error in document not found
    // //check path photo find in folder or no
    if (existsSync(directorFolderPath)) {
      // if found delete photo
      rmSync(directorFolderPath, { recursive: true, force: true });
    }
    mkdirSync(directorFolderPath, { recursive: true });
  }
};

module.exports = { deleteImage, deleteImagesInFolder };
