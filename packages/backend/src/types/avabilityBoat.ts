export type SingleBoatAvability = {
  data: SingleBoatDataAvability[];
  statusCode: number;
  status: string;
};

export type SingleBoatDataAvability = {
  charter?: string;
  availabilities: [
    {
      chin: string;
      chout: string;
    },
  ];
  _id: number;
  title: string;
  slug: string;
  cabins?: number;
  year?: number;
  marina?: string;
  bad_content?: boolean;
  illustrated?: boolean;
};
