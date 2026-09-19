import fs from 'fs';

/**
 * Safely deletes local temporary files uploaded by multer
 * @param {string|string[]} files Path or array of file paths to remove
 */
export const deleteFiles = (files) => {
  if (!files) return;
  const fileList = Array.isArray(files) ? files : [files];

  for (const file of fileList) {
    const filePath = typeof file === 'object' && file.path ? file.path : file;
    if (filePath && typeof filePath === 'string') {
      fs.unlink(filePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error(`Error deleting temp file ${filePath}:`, err.message);
        }
      });
    }
  }
};

export default { deleteFiles };

