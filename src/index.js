const { Readable } = require("stream");

module.exports = {
  init(config) {
    const { PixelbinConfig, PixelbinClient } = require("@pixelbin/admin");
    const pixelbinConfig = new PixelbinConfig(config);
    const pixelbinClient = new PixelbinClient(pixelbinConfig);
    const DEFAULT_PATH = "strapi-images";
    const folderPath = config.folderName || DEFAULT_PATH;
    
    // Helper function to extract the data after 'original/'
    const extractData = (url) => {
      const originalIndex = url.indexOf("original/");
      if (originalIndex !== -1) {
        return url.substring(originalIndex + "original/".length);
      }
      return null;
    };

    return {
      async upload(file, customParams = {}) {
        // Ensure necessary properties are defined
        const requiredProperties = ["buffer", "hash", "ext", "name"];
        if (
          !file ||
          !requiredProperties.every((prop) => file[prop] !== undefined)
        ) {
          throw new Error(
            "Invalid file object. Make sure it has buffer, hash, ext, and name properties."
          );
        }

        const fileData = {
          file: Readable.from(file.buffer),
          name: file.hash,
          options: {
            originalFilename: file.name,
          },
          path: folderPath,
          name: file.name,
          overwrite: true,
          ...customParams,
        };

        const response = await pixelbinClient.assets.fileUpload(fileData);
        // Set the file properties based on the response
        Object.assign(file, {
          url: response.url,
          ext: response.format,
          name: response.name,
          fileId: response.fileId,
        });

        return file;
      },

      async delete(file, customParams = {}) {
        const requiredProperties = ["url"];
        if (
          !file ||
          !requiredProperties.every((prop) => file[prop] !== undefined)
        ) {
          throw new Error(
            "Invalid file object. Make sure it has url property for delete operation."
          );
        }

        // Extract the relevant part of the URL
        const fileId = extractData(file.url);
        if (!fileId) {
          throw new Error("Invalid file URL. Unable to extract file ID.");
        }

        const response = await pixelbinClient.assets.deleteFile({
          fileId: `${fileId}`,
          ...customParams,
        });

        return response;
      },
    };
  },
};
