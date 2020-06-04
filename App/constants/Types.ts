export type Types = {
  filesType: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    description: string;
    filename: string;
    path: string;
    size: number;
  };

  dataItem: {
    _id: string;
    name: string;
    description: string;
    thumbnail: Types['filesType'];
    file: Types['filesType'];
  };
};
