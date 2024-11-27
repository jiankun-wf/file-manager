export enum ApiInterface {
  PROVIDER_LIST = "/file-providers",
  PROVIDER_ADD = "/add-provider",
  PROVIDER_DELETE = "/delete-provider",
  PROVIDER_UPDATE = "/update-provider",

  FILE_UPLOAD = "/upload",
  FILE_URL = "/public-url",
  FILE_CREATE = "/create-file",
  FILE_DEL = "/delete-file",
  FILE_MOVE = "/move-file",
  FILE_COPY = "/copy-file",
  FILE_RENAME = "/rename-file",
  FILE_DOWNLOAD = "/download-file",

  FOLDER_CREATE = "/create-folder",
  FOLDER_DEL = "/delete-folder",
  FOLDER_MOVE = "/move-folder",
  FOLDER_COPY = "/copy-folder",
  FOLDER_RENAME = "/rename-folder",
  FOLDER_CONTENT = "/file-list",
}
