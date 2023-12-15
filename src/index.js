const { Readable } = require("stream");

module.exports = {
  init(config) {
    const { PixelbinConfig, PixelbinClient } = require("@pixelbin/admin");
    const pixelbinConfig = new PixelbinConfig(config);
    const pixelbinClient = new PixelbinClient(pixelbinConfig);

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
        const requiredProperties = ["hash", "ext"];
        if (
          !file ||
          !requiredProperties.every((prop) => file[prop] !== undefined)
        ) {
          throw new Error(
            "Invalid file object. Make sure it has hash and ext properties for delete operation."
          );
        }

        const response = await pixelbinClient.assets.deleteFile({
          fileId: `${file.hash}.${file.ext}`,
          ...customParams,
        });

        return response;
      },
    };
  },
};
