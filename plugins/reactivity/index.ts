import { attachTypePatcherFactory } from 'ts-plus';
import { transformerFactory } from './transformer';
import { typePatcherFactory } from './typePatcher';

attachTypePatcherFactory(transformerFactory, typePatcherFactory);

export default transformerFactory;
