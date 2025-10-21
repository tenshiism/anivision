import { IdentifiedImage } from './image';
import { SpeciesIdentificationResult } from './api';

export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Camera: undefined;
  Gallery: undefined;
  ImageDetail: {
    image: IdentifiedImage;
  };
  Settings: undefined;
};

export type DrawerParamList = {
  Main: undefined;
  Settings: undefined;
  About: undefined;
};
