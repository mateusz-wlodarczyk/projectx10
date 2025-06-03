export type SingleBoatAvailability = {
  data: SingleBoatDataAvailability[];
  statusCode: number;
  status: string;
};

export type SingleBoatDataAvailability = {
  availabilities: {
    chin: string;
    chout: string;
  }[];
  _id: number;
  title: string;
  slug: string;
  bad_content: boolean;
  illustrated: boolean;
};

export type SingleBoatDataAvailabilitySimple = {
  availabilities: SingleAvailability[];
  slug: string;
};

export type SingleAvailability = {
  chin: string;
  chout: string;
};
